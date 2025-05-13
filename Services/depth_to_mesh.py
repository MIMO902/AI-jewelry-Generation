import open3d as o3d
import numpy as np
import cv2
import sys

def generate_point_cloud(color_path, depth_path, output_path):
    # Load RGB and depth images
    color_raw = cv2.imread(color_path)
    depth_raw = cv2.imread(depth_path, cv2.IMREAD_GRAYSCALE)

    # Resize depth to match RGB dimensions
    height, width, _ = color_raw.shape
    depth_resized = cv2.resize(depth_raw, (width, height), interpolation=cv2.INTER_CUBIC)

    # Normalize depth
    depth = depth_resized.astype(np.float32) / 255.0
    depth *= 2.0  # Adjust depth scaling as needed

    # Camera intrinsics (fx, fy, cx, cy)
    fx = fy = width / 2.0
    cx = width / 2.0
    cy = height / 2.0

    # Convert to Open3D images
    color_o3d = o3d.geometry.Image(cv2.cvtColor(color_raw, cv2.COLOR_BGR2RGB))
    depth_o3d = o3d.geometry.Image((depth * 1000).astype(np.uint16))  # Convert to mm
    rgbd_image = o3d.geometry.RGBDImage.create_from_color_and_depth(
        color_o3d, depth_o3d, convert_rgb_to_intensity=False
    )

    # Set camera intrinsics
    intrinsics = o3d.camera.PinholeCameraIntrinsic(width, height, fx, fy, cx, cy)

    # Create point cloud
    pcd = o3d.geometry.PointCloud.create_from_rgbd_image(rgbd_image, intrinsics)
    pcd.estimate_normals()

    # Filter out noise (statistical outlier removal)
    pcd, _ = pcd.remove_statistical_outlier(nb_neighbors=20, std_ratio=2.0)

    # Downsample to simplify mesh and reduce noise
    pcd = pcd.voxel_down_sample(voxel_size=1.0)

    # Crop with bounding box to keep only relevant geometry
    bbox = pcd.get_axis_aligned_bounding_box()
    bbox = bbox.scale(1.1, bbox.get_center())  # slightly enlarge
    pcd = pcd.crop(bbox)

    # Re-estimate normals after cleanup
    pcd.estimate_normals()

    # Generate mesh using Poisson reconstruction
    mesh, _ = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd, depth=9)

    # Simplify the mesh
    mesh = mesh.simplify_quadric_decimation(5000)
    mesh.remove_degenerate_triangles()
    mesh.remove_duplicated_triangles()
    mesh.remove_duplicated_vertices()
    mesh.remove_non_manifold_edges()

    # Save mesh
    o3d.io.write_triangle_mesh(output_path, mesh)
    print(f"✅ 3D mesh saved to {output_path}")

if __name__ == "__main__":
    color_path = sys.argv[1]
    depth_path = sys.argv[2]
    output_path = sys.argv[3]
    generate_point_cloud(color_path, depth_path, output_path)
