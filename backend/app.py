from fastapi import FastAPI, HTTPException
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