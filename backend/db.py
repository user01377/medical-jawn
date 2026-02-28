import sqlite3

def create_patient_list():
    con = sqlite3.connect('med_jawn_db')
    cursor = con.cursor()