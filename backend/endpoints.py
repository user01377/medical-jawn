import sqlite3
import json
import numpy as np



# returns user IDs and names
def get_all_patients():
    con = sqlite3.connect('database/patients.sqlite')
    cur = con.cursor()

    cur.execute('SELECT patient_id, name FROM patient')
    results = cur.fetchall()

    con.close()
    return results[0]

# returns single patient by id
def get_patient(patient_id):
    con = sqlite3.connect('database/patients.sqlite')
    cur = con.cursor()

    cur.execute('SELECT * FROM patient WHERE patient_id = ?', (patient_id,))

    results = cur.fetchone()

    con.close()
    return results

# returns all cholesterol data for patient
def get_cholesterol(patient_id):
    con = sqlite3.connect('database/patients.sqlite')
    cur = con.cursor()

    try:
        query = '''
        SELECT cholesterol, date
        FROM records
        WHERE patient_id = ?
        '''
        cur.execute(query, (patient_id,))
        row = cur.fetchall()

        # flips it into date, value for the frontend consistency
        result = { date: cholesterol for cholesterol, date in row }
        return result

    except sqlite3.Error as e:
        print("Failed to get cholesterol:", e)
        return None

    finally:
        con.close()

# returns dict for Systolic blood pressure
def get_systolic(patient_id):
    con = sqlite3.connect('database/patients.sqlite')
    cur = con.cursor()

    systolic = dict()

    try:
        query = '''
        SELECT date, systolic
        FROM records
        WHERE patient_id = ?
        ORDER BY date
        '''
        cur.execute(query, (patient_id,))
        rows = cur.fetchall()

        for date, sys_val in rows:
            systolic[date] = sys_val

        return systolic

    except sqlite3.Error as e:
        print("Failed to get blood pressure:", e)
        return None

    finally:
        con.close()

# returns dict for Diastolic blood pressure
def get_diastolic(patient_id):
    con = sqlite3.connect('database/patients.sqlite')
    cur = con.cursor()

    diastolic_data = dict()

    try:
        query = '''
        SELECT date, diastolic
        FROM records
        WHERE patient_id = ?
        ORDER BY date
        '''
        cur.execute(query, (patient_id,))
        rows = cur.fetchall()

        for date, diastolic_val in rows:
            diastolic_data[date] = diastolic_val

        return diastolic_data

    except sqlite3.Error as e:
        print("Failed to get blood pressure:", e)
        return None

    finally:
        con.close()

# returns the average of a patients systolic levels
def get_systolic_avg(patient_id):
    sys = get_systolic(patient_id)

    vals = np.array(list(sys.values()))
    return np.mean(vals)

# returns the average of a patients diastolic levels
def get_diastolic_avg(patient_id):
    dia = get_diastolic(patient_id)

    vals = np.array(list(dia.values()))
    return np.mean(vals)

# returns the average of a patients cholesterol levels
def get_cholesterol_avg(patient_id):
    chol = get_cholesterol(patient_id)

    vals = np.array(sorted(dict.values(chol)))
    return np.mean(vals)

def main():
    print(get_all_patients())
    print(get_patient(0))
    print(get_systolic(0))
    print(get_diastolic(0))
    print(get_cholesterol(0))
    print(get_systolic_avg(0))
    print(get_diastolic_avg(0))
    print(get_cholesterol_avg(0))


if __name__ == '__main__':
    main()