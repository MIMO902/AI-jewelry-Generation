import torch
import cv2
import numpy as np
import open3d as o3d
import sys
import os
from PIL import Image
from transformers import DPTFeatureExtractor, DPTForDepthEstimation
sys.stdout.reconfigure(encoding='utf-8')


def run_depth_estimation(input_path, depth_out_path):
    print("🔍 Loading MiDaS v3 (DPT Large) model...")
    processor = DPTFeatureExtractor.from_pretrained("Intel/dpt-hybrid-midas")
    model = DPTForDepthEstimation.from_pretrained("Intel/dpt-hybrid-midas")

    model.eval()

    print(f"📷 Reading input image: {input_path}")
    image = Image.open(input_path).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")

    print("🧠 Estimating depth...")
    with torch.no_grad():
        outputs = model(**inputs)
        depth = outputs.predicted_depth[0].cpu().numpy()

    print("📊 Normalizing and saving depth image...")
    depth_min = depth.min()
    depth_max = depth.max()
    depth_norm = (depth - depth_min) / (depth_max - depth_min)
    depth_colored = (depth_norm * 255).astype(np.uint8)
    cv2.imwrite(depth_out_path, depth_colored)
    print(f"✅ Depth map saved to {depth_out_path}")

    return depth_norm

def crop_object(rgb, depth_norm):
    print("✂️ Attempting to isolate jewelry object from depth...")
    depth_gray = (depth_norm * 255).astype(np.uint8)
    _, mask = cv2.threshold(depth_gray, 10, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        print("⚠️ No object found for cropping — using full image.")
        return rgb, depth_norm

    x, y, w, h = cv2.boundingRect(max(contours, key=cv2.contourArea))
    print(f"📦 Cropped bounding box: x={x}, y={y}, w={w}, h={h}")
    return rgb[y:y+h, x:x+w], depth_norm[y:y+h, x:x+w]

def create_mesh(rgb_crop, depth_crop, output_path):
    print("🛠 Preparing Open3D images...")
    height, width, _ = rgb_crop.shape
    fx = fy = width / 2.0
    cx = width / 2.0
    cy = height / 2.0

    print("🧼 Applying bilateral filter to depth...")
    # Apply bilateral filter
    depth_filtered = cv2.bilateralFilter((depth_crop * 255).astype(np.uint8), 9, 75, 75)

    # ✨ Add edge sharpening using the original image
    print("🧪 Applying edge-aware enhancement to depth map...")
    gray = cv2.cvtColor(rgb_crop, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, threshold1=100, threshold2=200)

    # Flatten edges in the depth map — prevents edge bleed
    depth_filtered[edges > 0] = np.mean(depth_filtered)

    # Convert back to float depth for mesh
    depth_final = depth_filtered.astype(np.float32) / 255.0 * 2.0


    color_o3d = o3d.geometry.Image(cv2.cvtColor(rgb_crop, cv2.COLOR_BGR2RGB))
    depth_o3d = o3d.geometry.Image((depth_final * 1000).astype(np.uint16))  # mm
    rgbd = o3d.geometry.RGBDImage.create_from_color_and_depth(color_o3d, depth_o3d, convert_rgb_to_intensity=False)

    intrinsics = o3d.camera.PinholeCameraIntrinsic(width, height, fx, fy, cx, cy)

    print("🔹 Generating point cloud from RGBD image...")
    pcd = o3d.geometry.PointCloud.create_from_rgbd_image(rgbd, intrinsics)
    pcd.estimate_normals()

    print("🧹 Removing outliers...")
    pcd, _ = pcd.remove_statistical_outlier(nb_neighbors=20, std_ratio=2.0)

    print("🧊 Downsampling point cloud...")
    pcd = pcd.voxel_down_sample(voxel_size=1.0)
    pcd.estimate_normals()

    print("📐 Creating mesh using Poisson surface reconstruction...")
    mesh, _ = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd, depth=9)

    print("🔧 Simplifying and cleaning mesh...")
    mesh = mesh.simplify_quadric_decimation(5000)
    mesh.remove_degenerate_triangles()
    mesh.remove_duplicated_triangles()
    mesh.remove_duplicated_vertices()
    mesh.remove_non_manifold_edges()
    mesh = mesh.filter_smooth_simple(number_of_iterations=5)

    print(f"💾 Saving mesh to: {output_path}")
    o3d.io.write_triangle_mesh(output_path, mesh)
    print("✅ 3D mesh generation complete!")

if __name__ == "__main__":
    input_image = sys.argv[1]
    output_depth = sys.argv[2]
    output_mesh = sys.argv[3]

    print("🚀 Starting 3D mesh generation pipeline...")
    rgb_raw = cv2.imread(input_image)

    depth = run_depth_estimation(input_image, output_depth)
    rgb_crop, depth_crop = crop_object(rgb_raw, depth)
    create_mesh(rgb_crop, depth_crop, output_mesh)
