import sqlite3
import numpy as np
def add_patient(user_id, name, age, weight, height):
    conn = sqlite3.connect('users.sqlite')
    cursor = conn.cursor()

    cursor.execute(f"INSERT INTO patient (user_id, name, age, weight, height) VALUES (?, ?, ?, ?)", (user_id, name, age, weight, height))
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

def update_or_add_patient(user_id, name, age, weight, height, systolic, diastolic, date):
    conn = sqlite3.connect('users.sqlite')
    cursor = conn.cursor()

    add_patient(user_id, name, age, weight, height)

    try:
        #cursor.execute('SELECT user_id FROM patient WHERE user_id = ?', (user_id,))

        add_patient(name, age, weight, height)

        add_blood_pressure(user_id, systolic, diastolic, date)
    except:
        print('except')


    finally:
        conn.close()

def main():

    rng = np.random.default_rng()
    sys = rng.integers(90, 361, 20)
    dia = rng.integers(50, 361, 20)
    year = 1987

    for i in range(len(sys)):
        update_or_add_patient(
            user_id=1,
            name="John Wic",
            age=21+i,
            weight=167,
            height=185,
            systolic=int(sys[i]),
            diastolic=int(dia[i]),
            date='2020-3-21'
        )

if __name__ == "__main__":
    main()