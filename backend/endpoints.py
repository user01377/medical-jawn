import sqlite3
import json


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
        row = cur.fetchone()
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

    systolic = {}

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

        return  json.dumps(systolic)

    except sqlite3.Error as e:
        print("Failed to get blood pressure:", e)
        return None

    finally:
        con.close()

# returns json object for Diastolic blood pressure
def get_diastolic(user_id):
    con = sqlite3.connect('blood.sqlite')
    cur = con.cursor()

    systolic = {}

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

def main():
    bp_s = get_systolic(1)
    bp_d = get_diastolic(1)
    print(bp_s)
    print(bp_d)


if __name__ == '__main__':
    main()