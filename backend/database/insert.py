import sqlite3
import numpy as np


def add_patient(patient_id, name, dob):
    con = sqlite3.connect('patients.sqlite')
    con.execute('PRAGMA foreign_keys = ON')
    cursor = con.cursor()

    cursor.execute(
        '''
        INSERT INTO patient(patient_id, name, date_of_birth)
        VALUES( ?, ?, ? )
        ''',
        (patient_id, name, dob)
    )
    con.commit()
    con.close()

def add_record(patient_id, weight, height, date, systolic, diastolic, cholesterol):
    con = sqlite3.connect('patients.sqlite')
    cursor = con.cursor()

    # Checks to see if inputed patient_id exists - prevents record being made for non-existant patients
    cursor.execute("SELECT 1 FROM patient WHERE patient_id = ?", (patient_id,))
    if cursor.fetchone() is None:
        raise ValueError("Patient ID does not exist")

    cursor.execute(
        '''
        INSERT INTO records (patient_id, weight, height, date, systolic, diastolic, cholesterol)
        VALUES( ?, ?, ?, ?, ?, ?, ? )
        ''', 
        (patient_id, weight, height, date, systolic, diastolic, cholesterol)
    )
    con.commit()
    con.close()




def main():
    add_patient( 00000000, 'Vincent Vue', '1206-08-14')
    add_record( 00000000, 781.8, 67, '2026-03-02', 128, 90, 56)
        
if __name__ == "__main__":
    main()