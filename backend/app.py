from fastapi import FastAPI,
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json

app = FastAPI()

# this is the file to expose endpoints to our frontend

