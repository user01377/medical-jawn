import sqlite3

conn = sqlite3.connect('users.sqlite')
cursor = conn.cursor()

# Create patient table in main database
cursor.execute('''
    CREATE TABLE IF NOT EXISTS patient (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER NOT NULL,
        weight INTEGER NOT NULL,
        height INTEGER NOT NULL
    )
''')

cursor.execute("""
    INSERT OR IGNORE INTO patient (user_id, name, age, weight, height)
    VALUES (1, 'Alice', 30, 70, 170)
""")

conn.commit()

# Attach second database
cursor.execute("ATTACH DATABASE 'blood.sqlite' AS blood")

# Create blood_pressure table in attached database
cursor.execute('''
    CREATE TABLE IF NOT EXISTS blood.blood_pressure (
        user_id INTEGER,
        systolic INTEGER NOT NULL,
        diastolic INTEGER NOT NULL
    )
''')

cursor.execute("""
    INSERT OR IGNORE INTO blood.blood_pressure (user_id, systolic, diastolic)
    VALUES (1, 120, 80)
""")

conn.commit()

# TEST QUERY
query = '''
SELECT 
    patient.name, 
    blood_pressure.systolic,
    blood_pressure.diastolic
FROM 
    patient
JOIN 
    blood.blood_pressure
ON 
    patient.user_id = blood.blood_pressure.user_id
'''

cursor.execute(query)
results = cursor.fetchall()

print("Cross-database join results:")
for row in results:
    print(row)

conn.close()