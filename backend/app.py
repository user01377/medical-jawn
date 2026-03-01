from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import endpoints
import sqlite3
import json

app = FastAPI()

@app.get("/all-patients")
def read_all_patients():
    return endpoints.get_all_patients()