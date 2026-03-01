import os
from dotenv import load_dotenv
import json
from google import genai
from endpoints import get_diastolic,get_systolic, get_patient


load_dotenv()
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

def predict_systolic(user_id):

    patient = get_patient(user_id)
    age = patient[2]
    weight = patient[3]
    height = patient[4]

    sys_data = json.loads(get_systolic(user_id))

    prompt = f"""You are a health data assistant. Here is the historical systolic blood pressure
    data for a person: {sys_data}

    The person was age {age} years old, {weight} pounds, and {height} cm tall in {next(iter(sys_data))} (year-month-day).
    Predict the systolic blood pressure for the next 5 years assuming the trend continues. Return ONLY a JSON
    dictionary mapping year in a yyyy-mm-dd sting format to predicted integer value. Do not include any explanation.
    """

    res = client.models.generate_content( model="gemini-2.5-flash", contents=prompt)
    return res.text

def predict_diastolic(user_id):

    patient = get_patient(user_id)
    age = patient[2]
    weight = patient[3]
    height = patient[4]

    dia_data = json.loads(get_diastolic(user_id))

    prompt = f"""You are a health data assistant. Here is the historical systolic blood pressure
    data for a person: {dia_data}

    The person was age {age} years old, {weight} pounds, and {height} cm tall in {next(iter(dia_data))} (year-month-day).
    Predict the systolic blood pressure for the next 5 years assuming the trend continues. Return ONLY a JSON
    dictionary mapping year in a yyyy-mm-dd string format to predicted integer value. Do not include any explanation.
    """

    res = client.models.generate_content( model="gemini-2.5-flash", contents=prompt)
    return res.text


def main():
    print(predict_systolic(2))

if __name__ == '__main__':
    main()