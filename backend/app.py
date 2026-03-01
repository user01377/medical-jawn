from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import endpoints
import sqlite3
import json

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins
)

@app.get("/all-patients")
def read_all_patients():
    return endpoints.get_all_patients()

@app.get("/get-patient/{user_id}")
def read_patient(user_id: int):
    patient = endpoints.get_patient(user_id)
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient with ID {user_id} not found")
    return patient

@app.get('/get-patient-sys-data/{user_id}')
def read_sys_data(user_id: int):
    data = endpoints.get_systolic(user_id)
    if data is None or len(data) == 0:
        raise HTTPException(status_code=404, detail=f"Entry with user id: {user_id} not found")
    return data

@app.get("/get-patient-cholesterol/{user_id}")
def read_patient_cholesterol(user_id: int):
    data = endpoints.get_cholesterol(user_id)
    if data is None or len(data) == 0:
        raise HTTPException(status_code=404, detail=f"Entry with user id: {user_id} not found")
    return data