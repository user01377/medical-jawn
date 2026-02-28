import sqlite3

conn = sqlite3.connect('users.sqlite')
cursor = conn.cursor()

# Create patient table in main database
cursor.execute('''
    CREATE TABLE IF NOT EXISTS patient (
        user_id INTEGER PRIMARY KEY,
        name TEXT,
        age INTEGER NOT NULL,
        weight INTEGER NOT NULL,
        height INTEGER NOT NULL
    )
''')

conn.commit()

# Attach second database
cursor.execute("ATTACH DATABASE 'blood.sqlite' AS blood")

# Create blood_pressure table in attached database
cursor.execute('''
    CREATE TABLE IF NOT EXISTS blood.blood_pressure (
        user_id INTEGER,
        systolic INTEGER NOT NULL,
        diastolic INTEGER NOT NULL,
        date TEXT NOT NULL
    )
''')


conn.commit()
