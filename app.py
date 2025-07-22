import streamlit as st
import cv2
import numpy as np
from PIL import Image
import pytesseract
import spacy
import pandas as pd

st.title("📄 Smart Document Scanner")

uploaded_file = st.file_uploader("Upload a receipt/invoice", type=["jpg", "png", "jpeg"])
capture = st.camera_input("Or take a photo")

image = uploaded_file if uploaded_file else capture

def preprocess_image(image):
    img = np.array(Image.open(image))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 150)
    return edged

def extract_text(image):
    text = pytesseract.image_to_string(np.array(Image.open(image)))
    return text

def parse_info(text):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    data = {"vendor": None, "date": None, "amount": None}
    for ent in doc.ents:
        if ent.label_ == "ORG" and not data["vendor"]:
            data["vendor"] = ent.text
        elif ent.label_ == "DATE" and not data["date"]:
            data["date"] = ent.text
        elif ent.label_ == "MONEY" and not data["amount"]:
            data["amount"] = ent.text
    return data

if image:
    st.image(image, caption="Uploaded Document", use_column_width=True)

    edged_image = preprocess_image(image)
    st.image(edged_image, caption="Edges Detected", use_column_width=True)

    extracted_text = extract_text(image)
    st.text_area("Extracted Text", extracted_text)

    parsed_data = parse_info(extracted_text)
    st.json(parsed_data)

    if st.button("Save Data"):
        df = pd.DataFrame([parsed_data])
        df.to_csv("receipt_data.csv", index=False)
        st.success("Saved to receipt_data.csv!")
