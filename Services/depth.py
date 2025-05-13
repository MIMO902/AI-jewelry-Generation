from transformers import DPTFeatureExtractor, DPTForDepthEstimation

# Change the repo name to any model you want
repo = "Intel/zoedepth-nyu-kitti"
extractor = DPTFeatureExtractor.from_pretrained(repo)
model = DPTForDepthEstimation.from_pretrained(repo)

# Save locally
extractor.save_pretrained("./local_models/zoedepth-nyu-kitti")
model.save_pretrained("./local_models/zoedepth-nyu-kitti")
