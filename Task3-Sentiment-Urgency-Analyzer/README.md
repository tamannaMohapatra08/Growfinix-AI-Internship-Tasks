# Task 3 - Semantic Sentiment & Urgency Analyzer

## Project Description

This project analyzes customer feedback using an AI model.

It identifies:

- Sentiment: Positive, Negative, or Neutral
- Urgency: High, Medium, or Low
- Main complaint or praise

## Technologies Used

- Python
- Hugging Face Inference API
- Hugging Face AI Model
- python-dotenv

## How It Works

Customer Feedback
↓
Python Application
↓
Hugging Face AI Model
↓
Sentiment + Urgency + Complaint
↓
JSON Output

## Example

Input:

My order has not arrived for 5 days and I need it urgently.

Output:

{
  "sentiment": "Negative",
  "urgency": "High",
  "complaint": "The customer has not received the order and needs it urgently."
}

## How to Run

Install dependencies:

pip install -r requirements.txt

Create a `.env` file:

HF_TOKEN=your_huggingface_token

Run:

python app.py