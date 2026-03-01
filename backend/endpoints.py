import sqlite3
import json
import numpy as np

# returns tuple of a full row in database
def get_db_row(user_id, table, db_path):
    con = sqlite3.connect(db_path)
    cur = con.cursor()

    try:
        query = f"SELECT * FROM {table} WHERE user_id = ?"
        cur.execute(query, (user_id,))
        row = cur.fetchone()
        return row

    except sqlite3.Error as e:
        print("Invalid DB query or connection failed:", e)
        return None

    finally:
        con.close()

# returns user IDs and names
def get_all_patients():
    con = sqlite3.connect('users.sqlite')
    cur = con.cursor()

    cur.execute('SELECT user_id, name FROM patient')
    results = cur.fetchall()

    con.close()
    return results

# returns single patient by id
def get_patient(user_id):
    con = sqlite3.connect('users.sqlite')
    cur = con.cursor()

    cur.execute(f'SELECT * FROM patient WHERE user_id = {user_id}')

    results = cur.fetchone()

    con.close()
    return results

# returns all cholesterol data for patient
def get_cholesterol(user_id):
    con = sqlite3.connect('blood.sqlite')
    cur = con.cursor()

    try:
        query = '''
        SELECT cholesterol, date
        FROM blood_pressure
        WHERE user_id = ?
        '''
        cur.execute(query, (user_id,))
        row = cur.fetchall()
        return row

    except sqlite3.Error as e:
        print("Failed to get cholesterol:", e)
        return None

    finally:
        con.close()

# returns all bloodpressure data of patient
def get_bloodpressure(user_id):
    con = sqlite3.connect('blood.sqlite')
    cur = con.cursor()

    try:
        query = '''
        SELECT systolic, diastolic, date
        FROM blood_pressure
        WHERE user_id = ?
        '''
        cur.execute(query, (user_id,))
        row = cur.fetchall()
        return row

    except sqlite3.Error as e:
        print("Failed to get blood pressure:", e)
        return None

    finally:
        con.close()

# returns json object for Systolic blood pressure
def get_systolic(user_id):
    con = sqlite3.connect('blood.sqlite')
    cur = con.cursor()

    systolic = dict()

    try:
        query = '''
        SELECT date, systolic
        FROM blood_pressure
        WHERE user_id = ?
        ORDER BY date
        '''
        cur.execute(query, (user_id,))
        rows = cur.fetchall()

        for date, sys_val in rows:
            systolic[date] = sys_val

        return systolic

    except sqlite3.Error as e:
        print("Failed to get blood pressure:", e)
        return None

    finally:
        con.close()

# returns json object for Diastolic blood pressure
def get_diastolic(user_id):
    con = sqlite3.connect('blood.sqlite')
    cur = con.cursor()

    systolic = dict()

    try:
        query = '''
        SELECT date, diastolic
        FROM blood_pressure
        WHERE user_id = ?
        ORDER BY date
        '''
        cur.execute(query, (user_id,))
        rows = cur.fetchall()

        for date, sys_val in rows:
            systolic[date] = sys_val

        return  json.dumps(systolic)

    except sqlite3.Error as e:
        print("Failed to get blood pressure:", e)
        return None

    finally:
        con.close()

# returns the average of a patients systolic levels
def get_systolic_avg(user_id):
    sys = json.loads(get_systolic(user_id))

    vals = np.array(sorted(dict.values(sys)))
    return np.mean(vals)

# returns the average of a patients diastolic levels
def get_diastolic_avg(user_id):
    dia = json.loads(get_diastolic(user_id))

    vals = np.array(sorted(dict.values(dia)))
    return np.mean(vals)

def main():
    print(get_all_patients())


if __name__ == '__main__':
    main()