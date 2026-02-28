import sqlite3
import numpy as np
def add_patient(name, age, weight, height):
    conn = sqlite3.connect('users.sqlite')
    cursor = conn.cursor()

    cursor.execute(f"INSERT INTO patient (name, age, weight, height) VALUES (?, ?, ?, ?)", (name, age, weight, height))
    conn.commit()

def add_blood_pressure(user_id, systolic, diastolic, date):
    conn = sqlite3.connect('blood.sqlite')
    cursor = conn.cursor()


    cursor.execute("""
        INSERT INTO blood_pressure (user_id, systolic, diastolic, date)
        VALUES (?, ?, ?, ?)
    """, (user_id, systolic, diastolic, date))

    conn.commit()
    conn.close()
    
def update_patient(user_id, systolic, diastolic, date):
    conn = sqlite3.connect('users.sqlite')

    try:
        add_blood_pressure(user_id, systolic, diastolic, date)
    except Exception as e:
        print(f'except: {e}')


    finally:
        conn.close()

def main():

    rng = np.random.default_rng()
    sys = rng.integers(90, 361, 20)
    dia = rng.integers(50, 361, 20)
    year = 1987
    add_patient(name='Jamk Performative', age=35, weight=180, height=70)
    for i in range(len(sys)):
        update_patient(
            user_id=1,
            systolic=int(sys[i]),
            diastolic=int(dia[i]),
            date=f'{year+1}-3-21'
        )
    add_patient(name='Vindent', age=67, weight=10, height=80)
    for i in range(len(sys)):
        update_patient(
            user_id=2,
            systolic=int(sys[i]),
            diastolic=int(dia[i]),
            date=f'{year+i}-6-21'
        )
    add_patient(name='Sigma Ryan', age=5000, weight=1830, height=6767)
    for i in range(len(sys)):
        update_patient(
            user_id=3,
            systolic=int(sys[i]),
            diastolic=int(dia[i]),
            date=f'{year-i}-8-21'
        )
        
if __name__ == "__main__":
    main()