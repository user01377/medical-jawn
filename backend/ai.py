import os
import json
from google import genai
from endpoints import get_diastolic,get_systolic, get_patient

client = genai.Client(genai_key=os.getenv('GEMINI_API_KEY'))

def predict(user_id):

    patient = get_patient(user_id)
    age = patient(2)
    weight = patient(3)
    weight = patient(4)

    sys_data = json.loads(get_systolic(user_id))
    dia_data = json.loads(get_diastolic(user_id))
    prompt = f"""you are a health data assistant


"""



