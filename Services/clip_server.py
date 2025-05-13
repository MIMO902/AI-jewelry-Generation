from flask import Flask, request, jsonify
from transformers import CLIPProcessor, CLIPModel
import torch

app = Flask(__name__)
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

@app.route('/clip-similarity', methods=['POST'])
def get_similarity():
    data = request.json
    text = data["text"]         # the prompt or caption
    labels = data["labels"]     # material names like "gold", "diamond"

    # Tokenize both the main caption and all candidate labels
    inputs = processor(
        text=[text] + labels, return_tensors="pt", padding=True, truncation=True
    )

    with torch.no_grad():
        embeddings = model.get_text_features(**inputs)
        embeddings = torch.nn.functional.normalize(embeddings, dim=-1)

    main = embeddings[0]        # embedding of caption/prompt
    candidates = embeddings[1:] # embeddings of all labels

    scores = torch.matmul(candidates, main.unsqueeze(1)).squeeze(1)  # cosine sim
    scores = scores.tolist()

    return jsonify({label: round(score, 4) for label, score in zip(labels, scores)})

if __name__ == "__main__":
    app.run(port=5005)
