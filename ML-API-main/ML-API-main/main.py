from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import requests
import joblib
from preprocessor import DiabetesPreprocessor

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static HTML
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    return FileResponse("static/index.html")

preprocessor: DiabetesPreprocessor = joblib.load("preprocessor.pkl")

class InputData(BaseModel):
    age: float
    bmi: float
    blood_glucose_level: float
    gender: str
    smoking_history: str
    HbA1c_level: float

@app.post("/predict")
def predict(data: InputData):
    processed = preprocessor.process(
        gender=data.gender,
        smoke=data.smoking_history,
        age=data.age,
        bmi=data.bmi,
        HbA1c=data.HbA1c_level,
        glucose=data.blood_glucose_level
    )

    payload = {
        "instances": [processed.tolist()]
    }

    tf_serving_ann = "http://tf-serving:8501/v1/models/ann:predict"
    response = requests.post(tf_serving_ann, json=payload)
    prediction = response.json()
    
    score = prediction["predictions"][0][0]
    label = "Diabetes" if score >= 0.5 else "Tidak Diabetes"

    return {
        "prediction_result": label,
        "score": score
    }