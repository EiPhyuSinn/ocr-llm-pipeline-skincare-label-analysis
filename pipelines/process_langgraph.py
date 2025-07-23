from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langchain_community.document_loaders import TextLoader
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph
from typing import TypedDict

from dotenv import load_dotenv 
import pytesseract
from PIL import Image
import numpy as np 
import os

from langchain_groq import ChatGroq
load_dotenv()

# Step 1: OCR node
def ocr_node(state):
    image_path = state["image_path"]
    text = pytesseract.image_to_string(np.array(Image.open(image_path)))
    return {"text": text}

# Step 2: Prompt/LLM node
def ask_question_node(state):
    text = state["text"]
    question = state["question"]
    prompt = f"Document: {text}\n\nQuestion: {question}"
    
    llm = ChatGroq(
            model_name="llama3-70b-8192",  
            temperature=0.7
        )
    response = llm.invoke(prompt)
    
    return {"answer": response.content}

# Define the expected data structure
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

result = graph.invoke({
    "image_path": "sample_images/good-example.jpg",
    "question": "Just list what are in the image?"
})

print(result["answer"])
