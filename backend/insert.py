import sqlite3
conn = sqlite3.connect('users.db')
cursor = conn.cursor()
def patient(name, age, weight, height):
    cursor.execute("INSERT INTO patient (name, age, weight, height) VALUES (?, ?, ?, ?)", (name, age, weight, height))
    conn.commit()
def blood_pressure(user_id, systolic, diastolic):
    cursor.execute("INSERT INTO blood.blood_pressure (user_id, systolic, diastolic) VALUES (?, ?, ?)", (user_id, systolic, diastolic))
    conn.commit()