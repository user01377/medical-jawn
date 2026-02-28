import numpy as np
import sqlite3

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