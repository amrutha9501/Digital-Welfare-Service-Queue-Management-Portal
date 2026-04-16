import mysql.connector
import bcrypt
import re

# DB connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Indian@9501",
    database="queue_management"
)

cursor = conn.cursor()

query = input("Enter INSERT statements:\n")

# Split multiple queries by ;
queries = [q.strip() for q in query.split(";") if q.strip()]

for q in queries:
    match = re.search(r"VALUES\s*\((.*)\)", q, re.IGNORECASE)
    
    if not match:
        print("Skipping invalid query:", q)
        continue

    values_str = match.group(1)
    values = [v.strip().strip("'") for v in values_str.split(",")]

    # Hash password (4th column)
    plain_password = values[3]
    hashed_password = bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt()).decode()
    values[3] = hashed_password

    new_query = """
    INSERT INTO users (name, phone, aadhaar, password)
    VALUES (%s, %s, %s, %s)
    """

    cursor.execute(new_query, values)

conn.commit()

print(f"✅ Inserted {len(queries)} users successfully!")

cursor.close()
conn.close()