import streamlit as st
import cv2
import numpy as np
from PIL import Image
import pytesseract
import spacy
import pandas as pd
import os

st.title("📄 Smart Document Scanner")

uploaded_file = st.file_uploader("Upload a receipt/invoice", type=["jpg", "png", "jpeg"])
# capture = st.camera_input("Or take a photo")

image = uploaded_file 

def preprocess_image(image):
    img = np.array(Image.open(image))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 150)
    return edged


if image:
    original_path = "original_image.jpg"
    with open(original_path, "wb") as f:
        f.write(image.getbuffer())
    st.success(f"Original image saved as {original_path}")

    # Preprocess and save
    edged_image = preprocess_image(image)
    st.image(edged_image, caption="Edges Detected", use_container_width=True)

    # Save preprocessed image
    preprocessed_path = "preprocessed_edges.jpg"
    cv2.imwrite(preprocessed_path, edged_image)
    st.success(f"Preprocessed image saved as {preprocessed_path}")
