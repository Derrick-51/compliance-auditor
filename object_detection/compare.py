from typing import List
from copy import deepcopy
import numpy as np
import cv2

def compareDHash(image: cv2.typing.MatLike,
                  target: cv2.typing.MatLike,
                  hash_size: int=8) -> float:
    import dhash
    from PIL import Image
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
    imageHash = int(dhash.format_hex(imageRow, imageCol), 16)
    targetHash = int(dhash.format_hex(targetRow, targetCol), 16)

    hammingDistance = dhash.get_num_bits_different(imageHash, targetHash)

    return hammingDistance
