import sqlite3


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
        SELECT systolic, diastolic
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


def main():
    row = get_db_row(1, 'blood_pressure' ,'blood.sqlite')

    if row:
        
        print(row)
    else:
        print("No blood pressure record found.")


if __name__ == '__main__':
    main()