from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import endpoints, ai
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

@app.get('/get_bp_avg/{user_id}')
def get_bp_avg(user_id: int):
    sys = int(endpoints.get_systolic_avg())
    dia = int(endpoints.get_diastolic_avg())

    avg = sys / dia
    if not avg:
        raise HTTPException(status_code=404, detail=f"Entry with user id: {user_id} not found")
    return avg


@app.get('/predict-patient-sys-data/{user_id}')
def read_sys_data(user_id: int):
    
    #raw_data = ai.predict_systolic(user_id) <-- uncomment on deployment

    # if not raw_data:
    #     raise HTTPException(
    #         status_code=404,
    #         detail=f"Predicted data for user id {user_id} not found"
    #     )

    # # Ensure raw_data is a dict
    # if not isinstance(raw_data, dict):
    #     raise HTTPException(
    #         status_code=500,
    #         detail=f"Predicted data is not a dictionary: {raw_data}"
    #     )

    # try:
    #     # Convert all values to integers
    #     data_dict = {k: int(v) for k, v in raw_data.items()}
    #     return data_dict
    # except Exception as e:
    #     raise HTTPException(
    #         status_code=500,
    #         detail=f"Failed to process predicted data: {e}"
    #     )
    return {
    "2007-03-21": 159,
    "2008-03-21": 157,
    "2009-03-21": 155,
    "2010-03-21": 153,
    "2011-03-21": 151,
}

@app.get('/predict-patient-dia-data/{user_id}')
def read_sys_data(user_id: int):
    
    #raw_data = ai.predict_diastolic(user_id) <-- uncomment on deployment

    # if not raw_data:
    #     raise HTTPException(
    #         status_code=404,
    #         detail=f"Predicted data for user id {user_id} not found"
    #     )

    # # Ensure raw_data is a dict
    # if not isinstance(raw_data, dict):
    #     raise HTTPException(
    #         status_code=500,
    #         detail=f"Predicted data is not a dictionary: {raw_data}"
    #     )

    # try:
    #     # Convert all values to integers
    #     data_dict = {k: int(v) for k, v in raw_data.items()}
    #     return data_dict
    # except Exception as e:
    #     raise HTTPException(
    #         status_code=500,
    #         detail=f"Failed to process predicted data: {e}"
    #     )
    return {
    "2007-03-21": 159,
    "2008-03-21": 157,
    "2009-03-21": 155,
    "2010-03-21": 153,
    "2011-03-21": 151,
}