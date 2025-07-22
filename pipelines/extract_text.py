import cv2
import numpy as np
from PIL import Image
import pytesseract


def extract_text_tess(image):
    text = pytesseract.image_to_string(np.array(Image.open(image)))
    return text

extracted_text = extract_text_tess('preprocessed_edges.jpg')
print(f'Extracted text from pytesseract :', extracted_text)


import easyocr
def extract_text_easyocr(image):
    reader = easyocr.Reader(['en']) 
    img_array = np.array(Image.open(image))
    result = reader.readtext(img_array, detail=0)
    return "\n".join(result)

extracted_text = extract_text_easyocr('preprocessed_edges.jpg')
print(f'Extracted text from easyocr :', extracted_text)