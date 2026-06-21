import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "wealthseed.db")

def migrate():
    print(f"Connecting to {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    columns_to_add = [
        ("full_name", "VARCHAR"),
        ("age", "INTEGER"),
        ("country", "VARCHAR"),
        ("occupation", "VARCHAR"),
        ("annual_income", "FLOAT"),
        ("investment_experience", "VARCHAR"),
        ("financial_goal", "VARCHAR"),
        ("updated_at", "DATETIME")
    ]

    for col_name, col_type in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE user_profiles ADD COLUMN {col_name} {col_type}")
            print(f"Added column {col_name}")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print(f"Column {col_name} already exists.")
            else:
                print(f"Error adding {col_name}: {e}")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
