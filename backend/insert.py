import sqlite3
import numpy as np
def add_patient(user_id, name, age, weight, height):
    conn = sqlite3.connect('users.sqlite')
    cursor = conn.cursor()

    cursor.execute(f"INSERT INTO patient (user_id, name, age, weight, height) VALUES (?, ?, ?, ?, ?)", (user_id, name, age, weight, height))
    conn.commit()

def add_blood_pressure(user_id, systolic, diastolic, date):
    conn = sqlite3.connect('blood.sqlite')
    cursor = conn.cursor()


    cursor.execute("""
        INSERT INTO blood_pressure (user_id, systolic, diastolic, date)
        VALUES (?, ?, ?, ?)
    """, (user_id, systolic, diastolic, date))

    conn.commit()
    conn.close()
    
def update_patient(user_id, systolic, diastolic, date):
    conn = sqlite3.connect('users.sqlite')

    try:
        #cursor.execute('SELECT user_id FROM patient WHERE user_id = ?', (user_id,))


        add_blood_pressure(user_id, systolic, diastolic, date)
    except Exception as e:
        print(f'except: {e}')


    finally:
        conn.close()

names = [
"milo bracken",
"tessa vale",
"ryker thorne",
"luna cairn",
"ellis draven",
"nora quill",
"zane hollis",
"ivy mercer",
"caden frost",
"marla kestrel",
"owen strade",
"kiara blythe",
"daxen rowe",
"selah vance",
"briar locke",
"trent hollin",
"lyra madden",
"asher knox",
"renzo clarke",
"maeve darren",
]
def main():
    rng = np.random.default_rng()
    sys = rng.integers(90, 361, 20)
    dia = rng.integers(50, 361, 20)
    age = rng.integers(18, 90, 20)
    weight = rng.integers(100, 300, 20)
    height = rng.integers(50, 80, 20)
    year = 1987
    for i in range(len(names)):
        ids1 = rng.integers(1, 9999)
        ids2 = rng.integers(1, 9999)
        ids3 = rng.integers(1, 9999)
        idmain = int(f'{ids1}{ids2}{ids3}')
        print(idmain)
        add_patient(user_id=idmain, name=names[i], age=age[i], weight=weight[i], height=height[i])
        for j in range(len(sys)):
            update_patient(
                user_id=idmain,
                systolic=int(sys[j]),
                diastolic=int(dia[j]),
                date=f'{year+j}-3-21'
            )
        
if __name__ == "__main__":
    main()