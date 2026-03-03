import sqlite3

con = sqlite3.connect('patients.sqlite')
con.execute('PRAGMA foreign_keys = ON')
cursor = con.cursor()

# Create patient table in the database
cursor.execute('''
    CREATE TABLE IF NOT EXISTS patient(
        patient_id INTEGER PRIMARY KEY,
        name TEXT,
        date_of_birth TEXT
    )
''')
con.commit()

# Create table in patient database with information from appointment document
cursor.execute('''
    CREATE TABLE IF NOT EXISTS records(
        record_id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        weight REAL NOT NULL,
        height INTEGER NOT NULL,
        date TEXT NOT NULL,
        systolic INTEGER NOT NULL,
        diastolic INTEGER NOT NULL,
        cholesterol INTEGER NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
    )
''')
con.commit()
con.close()
