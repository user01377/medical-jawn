import os
from dotenv import load_dotenv
import json
from google import genai
from endpoints import get_diastolic,get_systolic, get_patient
import re


load_dotenv()
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

import json
import re

def predict_systolic(user_id):
    patient = get_patient(user_id)
    age = patient[2]
    weight = patient[3]
    height = patient[4]

    sys_data = get_systolic(user_id)

    prompt = f"""You are a health data assistant. Here is the historical systolic blood pressure data for a person: {sys_data}. 
    The person was {age} years old, {weight} pounds, and {height} cm tall as of {next(iter(sys_data))}.

<<<<<<< HEAD
    The person was age {age} years old, {weight} pounds, and {height} cm tall in {next(iter(sys_data))} (year-month-day).
    Predict the systolic blood pressure for the next 5 years assuming the trend continues. Return ONLY a JSON
    dictionary mapping year in a yyyy-mm-dd string format to predicted integer value. Do not include any explanation.
=======
    Predict the systolic blood pressure for the next 5 years assuming the trend continues. 

    **Return only a valid JSON dictionary** with the following rules:
    - Keys must be unique dates in yyyy-mm-dd format.
    - Values must be integers.
    - Do not include any duplicate keys.
    - Do not include any text, explanation, or code block markers.
    - Only return the JSON object.
>>>>>>> ai-graph
    """

    res = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt
    )

    text = res.text.strip()

    text = re.sub(r'^```(?:json)?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'```$', '', text, flags=re.IGNORECASE)
    text = text.strip()

    try:
        data_dict = json.loads(text)

        # Ensure all values are integers
        for k, v in data_dict.items():
            data_dict[k] = int(v)

        return data_dict

    except json.JSONDecodeError:
        # Log the text so you can debug what Gemini returned
        print("Failed to parse Gemini JSON:", text)
        return {}

def predict_diastolic(user_id):
    patient = get_patient(user_id)
    age = patient[2]
    weight = patient[3]
    height = patient[4]

    dia_data = get_diastolic(user_id)

    prompt = f"""You are a health data assistant. Here is the historical diastolic blood pressure data for a person: {dia_data}. 
    The person was {age} years old, {weight} pounds, and {height} cm tall as of {next(iter(dia_data))}.

    Predict the systolic blood pressure for the next 5 years assuming the trend continues. 

    **Return only a valid JSON dictionary** with the following rules:
    - Keys must be unique dates in yyyy-mm-dd format.
    - Values must be integers.
    - Do not include any duplicate keys.
    - Do not include any text, explanation, or code block markers.
    - Only return the JSON object.
    """

    res = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt
    )

    text = res.text.strip()

    text = re.sub(r'^```(?:json)?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'```$', '', text, flags=re.IGNORECASE)
    text = text.strip()

    try:
        data_dict = json.loads(text)

        # Ensure all values are integers
        for k, v in data_dict.items():
            data_dict[k] = int(v)

        return data_dict

    except json.JSONDecodeError:
        # Log the text so you can debug what Gemini returned
        print("Failed to parse Gemini JSON:", text)
        return {}


def main():
    pass

if __name__ == '__main__':
    main()
