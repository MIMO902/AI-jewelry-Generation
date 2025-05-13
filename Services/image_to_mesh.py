import os
import torch
import cv2
import numpy as np
import open3d as o3d
import sys
import io
import time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
os.environ["OMP_NUM_THREADS"] = str(os.cpu_count())

# Add Depth Anything path
sys.path.append("C:/Users/youssef/Desktop/testing/Depth-Anything-V2")
from depth_anything_v2.dpt import DepthAnythingV2

def load_model():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🔧 Loading DepthAnythingV2 model on {device}...")
    model_path = "C:/Users/youssef/Desktop/testing/Depth-Anything-V2/checkpoints/depth_anything_v2_vitl.pth"
    model = DepthAnythingV2(encoder='vitl', features=256, out_channels=[256, 512, 1024, 1024])
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    return model, device

def run_depth_estimation(input_path, depth_out_path, model, device):
    print("🧠 Estimating depth...")
    raw_image = cv2.imread(input_path)
    if raw_image is None:
        raise RuntimeError("❌ Failed to load input image")

    # ✅ Pass raw BGR NumPy image to model
    with torch.no_grad():
        depth = model.infer_image(raw_image).squeeze()

    depth_min, depth_max = depth.min().item(), depth.max().item()
    if depth_max - depth_min == 0:
        raise RuntimeError("⚠️ Flat depth map")

    depth_np = ((depth - depth_min) / (depth_max - depth_min) * 255).cpu().numpy().astype(np.uint8)

    new_size = (depth_np.shape[1] * 2, depth_np.shape[0] * 2)
    depth_np = cv2.resize(depth_np, new_size, interpolation=cv2.INTER_CUBIC)
    cv2.imwrite(depth_out_path, depth_np)

    print(f"✅ Depth map saved to {depth_out_path}")
    return depth_np.astype(np.float32) / 255.0, new_size


def crop_object(rgb, depth_norm):
    print("✂️ Cropping jewelry object...")
    depth_gray = (depth_norm * 255).astype(np.uint8)
    _, mask = cv2.threshold(depth_gray, 10, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        print("⚠️ No object found. Using full image.")
        return rgb, depth_norm
    x, y, w, h = cv2.boundingRect(max(contours, key=cv2.contourArea))
    return rgb[y:y+h, x:x+w], depth_norm[y:y+h, x:x+w]

def create_mesh(rgb_crop, depth_crop, output_path):
    print("🔧 Generating balanced-quality 3D mesh...")
    h, w, _ = rgb_crop.shape
    fx = fy = w / 2.0
    cx = w / 2.0
    cy = h / 2.0

    depth_scaled = (depth_crop * 255).astype(np.uint8)

    # Edge enhancement
    gray = cv2.cvtColor(rgb_crop, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 80, 150)
    if edges.shape == depth_scaled.shape:
        depth_scaled[edges > 0] = np.clip(depth_scaled[edges > 0] * 1.2, 0, 255).astype(np.uint8)

    depth_final = depth_scaled.astype(np.float32) / 255.0 * 2.0

    color_o3d = o3d.geometry.Image(cv2.cvtColor(rgb_crop, cv2.COLOR_BGR2RGB))
    depth_o3d = o3d.geometry.Image((depth_final * 1000).astype(np.uint16))
    rgbd = o3d.geometry.RGBDImage.create_from_color_and_depth(
        color_o3d, depth_o3d, depth_trunc=3.0, convert_rgb_to_intensity=False
    )
    intrinsics = o3d.camera.PinholeCameraIntrinsic(w, h, fx, fy, cx, cy)

    pcd = o3d.geometry.PointCloud.create_from_rgbd_image(rgbd, intrinsics)
    pcd.estimate_normals()
    print(f"🔹 Original points: {len(pcd.points)}")

    pcd = pcd.voxel_down_sample(voxel_size=0.75)
    pcd.estimate_normals()

    try:
        pcd.orient_normals_consistent_tangent_plane(10)
    except RuntimeError:
        print("⚠️ Skipping consistent normal orientation.")

    print(f"🔹 After downsampling: {len(pcd.points)}")

    mesh, _ = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd, depth=8)

    mesh.compute_vertex_normals()
    mesh.remove_degenerate_triangles()
    mesh.remove_duplicated_triangles()
    mesh.remove_duplicated_vertices()
    mesh.remove_non_manifold_edges()

    o3d.io.write_triangle_mesh(output_path, mesh)
    print(f"✅ Mesh saved: {output_path}")

if __name__ == "__main__":
    try:
        t0 = time.time()
        input_image = sys.argv[1]
        output_depth = sys.argv[2]
        output_mesh = sys.argv[3]

        print("🚀 Starting mesh generation pipeline...")
        model, device = load_model()
        depth, new_size = run_depth_estimation(input_image, output_depth, model, device)
        rgb_raw = cv2.imread(input_image)
        rgb_resized = cv2.resize(rgb_raw, new_size)
        rgb_crop, depth_crop = crop_object(rgb_resized, depth)
        create_mesh(rgb_crop, depth_crop, output_mesh)
        print(f"⏱️ Finished in {time.time() - t0:.2f} sec")

    except Exception as e:
        import traceback
        print("🔥 UNCAUGHT ERROR:")
        traceback.print_exc()
        sys.exit(1)
