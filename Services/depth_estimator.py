# services/depth_estimator.py
import sys
import torch
import cv2
import numpy as np
from PIL import Image
from transformers import DPTFeatureExtractor, DPTForDepthEstimation

def estimate_depth(image_path, output_path):
    image = Image.open(image_path).convert("RGB")

    feature_extractor = DPTFeatureExtractor.from_pretrained("Intel/dpt-hybrid-midas")
    model = DPTForDepthEstimation.from_pretrained("Intel/dpt-hybrid-midas")
    model.eval()

    inputs = feature_extractor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)
        predicted_depth = outputs.predicted_depth.squeeze().cpu().numpy()

    # Normalize for visualization and save
    depth_image = (predicted_depth - predicted_depth.min()) / (predicted_depth.max() - predicted_depth.min())
    depth_colored = (depth_image * 255).astype(np.uint8)
    cv2.imwrite(output_path, depth_colored)

if __name__ == "__main__":
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    estimate_depth(input_path, output_path)
