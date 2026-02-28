import numpy as np
import sqlite3


# Returns tuple containing data for specific row in a db table
def get_db_row(id, subtable, db_path):
    con = sqlite3.connect(db_path)
    cur = con.cursor()

    try:
        query =  cur.execute('SELECT * FROM db_path WHERE id = ?')
        return query
    except:
        print('invalid db query or connection failed.')
        return []
    finally:
        if con:
            con.close()

def get_bloodpressure(id, subtable):
    con = sqlite3.connect('blood.blood_pressure')
    cur = con.cursor()

    try:
        dia = cur.execute('SELECT blood.blood_pressure.diastolic')
        sys = cur.execute('SELECT blood.blood_pressure.systolic')
        print(dia)
        print(sys)
    except:
        print('failed to get bloodpressure')
        return []
    finally:
        if con:
            con.close()