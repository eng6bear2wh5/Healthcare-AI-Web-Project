import sys
import json
import torch
from PIL import Image
import torchvision.transforms as transforms
from torchvision import models
import torch.nn as nn

# Check if GPU is available
device = torch.device("cpu")

# Class names - replace with your actual class names from the dataset
class_names = [
    "acne", "actinic_keratosis", "atopic_dermatitis", "bullous_disease", 
    "cellulitis", "eczema", "exanthems", "hair_loss", "herpes_HPV", 
    "light_diseases", "lupus", "melanoma", "nail_fungus", "poison_ivy", 
    "psoriasis", "scabies", "seborrheic_keratoses", "systemic_disease", 
    "tinea", "urticaria", "vascular_tumors", "vasculitis", "warts_molluscum"
]  # Update this with your actual class names

def load_model():
    # Load a pre-trained DenseNet-121 model
    model = models.densenet121(pretrained=False)
    
    # Modify the classifier for our number of classes
    num_features = model.classifier.in_features
    model.classifier = nn.Sequential(
        nn.Linear(num_features, 512),
        nn.ReLU(),
        nn.Dropout(0.4),
        nn.Linear(512, 256),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(256, len(class_names))
    )
    
    # Load your trained model weights
    model.load_state_dict(torch.load('model/model_epoch_25.pth', map_location=device))
    model.to(device)
    model.eval()
    
    return model

def preprocess_image(image_path):
    # Define the same transformation as in your training code
    transform = transforms.Compose([
        transforms.Resize((512, 512)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    
    # Open and preprocess the image
    image = Image.open(image_path).convert('RGB')
    image_tensor = transform(image).unsqueeze(0)  # Add batch dimension
    
    return image_tensor.to(device)

def predict(model, image_tensor):
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
        
    # Get top 3 predictions
    top3_prob, top3_indices = torch.topk(probabilities, 3)
    
    results = []
    for i in range(3):
        results.append({
            "class": class_names[top3_indices[i].item()],
            "probability": float(top3_prob[i].item()) * 100  # Convert to percentage
        })
    
    return results

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Please provide an image path"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        # Load model
        model = load_model()
        
        # Preprocess image
        image_tensor = preprocess_image(image_path)
        
        # Make prediction
        prediction_results = predict(model, image_tensor)
        
        # Output results as JSON
        print(json.dumps({
            "success": True,
            "predictions": prediction_results
        }))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()