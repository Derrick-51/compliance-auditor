from typing import List
from copy import deepcopy
import cv2
import dhash
import torch
import clip
from PIL import Image

def compareDHash(image: cv2.typing.MatLike,
                  target: cv2.typing.MatLike,
                  hash_size: int=8) -> float:
    
    dhash.force_pil()

    imageCopy = deepcopy(image)
    targetCopy = deepcopy(target)

    # Convert to PIL image (required)
    imageCopy = cv2.cvtColor(imageCopy, cv2.COLOR_BGR2RGB)
    targetCopy = cv2.cvtColor(targetCopy, cv2.COLOR_BGR2RGB)
    imageCopy = Image.fromarray(imageCopy)
    targetCopy = Image.fromarray(targetCopy)

    imageGraySmall = imageCopy.convert('L').resize((hash_size+1, hash_size+1))
    targetGraySmall = targetCopy.convert('L').resize((hash_size+1, hash_size+1))

    imageRow, imageCol = dhash.dhash_row_col(imageGraySmall, size=hash_size)
    targetRow, targetCol = dhash.dhash_row_col(targetGraySmall, size=hash_size)
    imageHash = int(dhash.format_hex(imageRow, imageCol, size=hash_size), 16)
    targetHash = int(dhash.format_hex(targetRow, targetCol, size=hash_size), 16)

    hammingDistance = dhash.get_num_bits_different(imageHash, targetHash)
    similarityRatio = 1 - (hammingDistance / (hash_size * hash_size * 2))

    return similarityRatio

def compareCosSimilarity(image: cv2.typing.MatLike,
                         target_features: List[torch.float32]) -> float:
    
    device = "cpu"
    model, preprocess = clip.load("ViT-B/32", device=device)

    image = preprocess(Image.fromarray(image)).unsqueeze(0).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image)

    cos_sim = torch.nn.CosineSimilarity(dim=1)
    similarity = cos_sim(image_features, target_features)

    return float(similarity)

def getCriterionFeatures(image: cv2.typing.MatLike) -> List[torch.float32]:
    
    device = "cpu"
    model, preprocess = clip.load("ViT-B/32", device=device)

    image = preprocess(Image.fromarray(image)).unsqueeze(0).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image)

    return image_features

def compareSiftFeatures(image: cv2.typing.MatLike,
                        target: cv2.typing.MatLike,
                        ratio_test_coeff: float = 0.60) -> float:
    
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    target = cv2.cvtColor(target, cv2.COLOR_BGR2GRAY)
    
    # Detect features
    sift = cv2.SIFT_create()
    image_keypoints, image_descriptors = sift.detectAndCompute(image, None)
    target_keypoints, target_descriptors = sift.detectAndCompute(target, None)

    # Match features
    matcher = cv2.BFMatcher()
    matches = matcher.knnMatch(image_descriptors, target_descriptors, k=2)

    # Apply ratio test
    goodMatches = []
    for m,n in matches:
        if m.distance < ratio_test_coeff * n.distance: # Higher coefficient is less strict
            goodMatches.append([m])

    if(len(matches)):
        return len(goodMatches) / len(matches)
    else:
        return 0.0