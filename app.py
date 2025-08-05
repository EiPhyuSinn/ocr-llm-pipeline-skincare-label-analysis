import streamlit as st
from PIL import Image
import pytesseract
import numpy as np
import tempfile
from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph
from typing import TypedDict

load_dotenv()

def ocr_node(state):
    image_path = state["image_path"]
    text = pytesseract.image_to_string(np.array(Image.open(image_path)))
    return {"text": text}

def ask_question_node(state):
    text = state["text"].strip()
    question = state["question"].strip().lower()

    if not text:
        return {"answer": "❌ Sorry, I couldn't read any text from the image. Please upload a clearer image."}

    prompt = f"You are a skincare ingredient expert. Only answer questions based on this product label.\n\nDocument:\n{text}\n\nQuestion: {question}"
    llm = ChatGroq(model_name="llama3-70b-8192", temperature=0.7)
    response = llm.invoke(prompt)
    return {"answer": response.content}


class GraphState(TypedDict):
    image_path: str
    text: str
    question: str
    answer: str

builder = StateGraph(GraphState)
builder.add_node("OCR", ocr_node)
builder.add_node("AskQuestion", ask_question_node)
builder.set_entry_point("OCR")
builder.add_edge("OCR", "AskQuestion")
builder.set_finish_point("AskQuestion")
graph = builder.compile()

st.set_page_config(page_title="📄 OCR + LLM QA", layout="centered")
st.title("📄 Ask Questions About Your Image")

uploaded_file = st.file_uploader("Upload an image (receipt, label, etc)", type=["jpg", "jpeg", "png"])

if uploaded_file:
    st.image(uploaded_file, caption="Uploaded Image", use_column_width=True)
    question = st.text_input("Ask a question about the image")

    if question:
        with st.spinner("Processing image and querying LLM..."):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_file:
                tmp_file.write(uploaded_file.read())
                tmp_image_path = tmp_file.name

            result = graph.invoke({
                "image_path": tmp_image_path,
                "question": question
            })

            st.subheader("📝 Extracted Text")
            st.text(result["text"].strip())

            st.subheader("🤖 LLM Answer")
            st.success(result["answer"].strip())
