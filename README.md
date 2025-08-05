# Product Ingredient Analyzer
[Screencast from 08-05-2025 02:14:38 PM.webm](https://github.com/user-attachments/assets/129b769c-587f-4484-bdb5-3e827ced14e2)


A smart application that combines Computer Vision (OCR) and Natural Language Processing (LLM) to analyze product ingredients from images and provide insights.

## Features

- **Image Processing**: Extract text from product labels using OCR (Optical Character Recognition)
- **Ingredient Analysis**: Understand product composition using LLM (Large Language Model)
- **Question Answering**: Ask questions about the product and get intelligent responses
- **Product Recommendations**: Get personalized skincare recommendations based on your needs
- **Ingredient Lookup**: Detailed information about specific ingredients

## Tech Stack

### Backend
- **FastAPI**: Python web framework for building APIs
- **Tesseract OCR**: Optical Character Recognition for text extraction
- **LangChain/Groq**: For LLM integration and workflow management
- **LangGraph**: For building and managing the analysis workflow
- **Skincare API**: External API for product and ingredient data

### Frontend (React)
- **React**: Frontend JavaScript library
- **Axios**: For API communication
- **CSS**: Custom styling for a user-friendly interface

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js (for frontend)
- Tesseract OCR installed on your system

### Installation

1. **Clone the repository**
   ```bash
   git clone  https://github.com/EiPhyuSinn/ocr-llm-pipeline-skincare-label-analysis.git
   ```

2. **Set up backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Set up frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment variables**
   Create a `.env` file in the backend directory with:
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

### Running the Application

1. **Start backend**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Start frontend**
   ```bash
   cd frontend
   npm start
   ```

## Usage

1. Upload an image of a product label
2. Ask questions about the product (e.g., "Is this good for sensitive skin?")
3. Get personalized recommendations based on your skin type and concerns

## How It Works

1. **OCR Processing**: The system extracts text from the uploaded image using Tesseract OCR
2. **LLM Analysis**: The extracted text is analyzed by an LLM (Llama 3 70B via Groq)
3. **Workflow Management**: LangGraph manages the workflow between OCR and LLM steps
4. **API Integration**: Additional product data is fetched from the Skincare API when needed

