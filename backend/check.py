import sqlite3

conn = sqlite3.connect('wealthseed.db')
columns = conn.execute("PRAGMA table_info(user_profiles)").fetchall()
for col in columns:
    print(col[1])
