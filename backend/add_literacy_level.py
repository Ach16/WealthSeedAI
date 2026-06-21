import sqlite3

def migrate():
    conn = sqlite3.connect('wealthseed.db')
    cursor = conn.cursor()
    
    try:
        # Add literacy_level if it doesn't exist
        cursor.execute("ALTER TABLE user_profiles ADD COLUMN literacy_level VARCHAR DEFAULT 'Beginner'")
        print("Successfully added literacy_level to user_profiles.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("Column literacy_level already exists.")
        else:
            print(f"Error: {e}")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()
