import sqlite3
conn = sqlite3.connect('users.db')
cursor = conn.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS patient (
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    age INTEGER NOT NULL,
                    weight INTEGER NOT NULL,
                    height INTEGER NOT NULL
                )''')
cursor.execute("INSERT OR IGNORE INTO patient VALUES (1, 'Alice', 30, 70, 170)")
conn.commit()

cursor.execute("ATTACH DATABASE 'blood.db' AS blood")

cursor.execute('''CREATE TABLE IF NOT EXISTS blood.blood_pressure (
                    user_id INTEGER,
                    systolic INTEGER NOT NULL,
                    diastolic INTEGER NOT NULL
                )''')
cursor.execute("INSERT OR IGNORE INTO blood.blood_pressure VALUES (1, 120, 80)")
conn.commit()
"""
# TEST QUERY
query = '''
SELECT 
    main.patient.name, 
    blood.blood_pressure.systolic,
    blood.blood_pressure.diastolic
FROM 
    main.patient
JOIN 
    blood.blood_pressure ON main.patient.user_id = blood.blood_pressure.user_id
'''

cursor.execute(query)
results = cursor.fetchall()

print("Cross-database join results:")
for row in results:
    print(row)
"""