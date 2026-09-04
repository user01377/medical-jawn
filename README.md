# MedicalJawn

**MedicalJawn** is a full-stack medical data visualization application that tracks patient blood pressure and cholesterol data, visualizes historical trends, and uses the **Google Gemini API** to generate predictions based on existing patient data.

Built for the **WiCHacks 2026 Spring Hackathon** at RIT.

[View the project on DevPost for more details](#)

## Demo

![MedicalJawn Dashboard](https://github.com/user-attachments/assets/79a88918-9b8a-4dc8-8067-8eaa7edd1645)

The dashboard visualizes historical patient data alongside an AI-generated prediction of how the patient's blood pressure may trend over the following years if current trends continue.

## Tech Stack

| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| React             | Frontend and data visualization  |
| FastAPI           | Backend REST API                 |
| SQLite            | Patient data and medical history |
| NumPy             | Data processing and analysis     |
| Google Gemini API | AI-powered trend prediction      |

## Basic architecture for our tool

```text
SQLite Database
      ↓
   FastAPI
      ↓
 Data Processing
   ├── NumPy
   └── Gemini API
      ↓
    React
      ↓
Patient Data Visualization Graph
```
