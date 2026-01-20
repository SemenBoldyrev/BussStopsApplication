import sqlite3
import os

# Configuration - update these paths if necessary
sql_file_path = r'Data\DBTables\Boldyrev_routes.sql'
db_file_path = r'Data\DBTables\BusStopsDB.sqlite'

def import_sql():
    if not os.path.exists(sql_file_path):
        print(f"Error: file {sql_file_path} not found.")
        return

    try:
        # Connect to SQLite (it will create the file if it doesn't exist)
        conn = sqlite3.connect(db_file_path)
        cursor = conn.cursor()

        print(f"Reading {sql_file_path}...")
        with open(sql_file_path, 'r', encoding='utf-8') as sql_file:
            sql_script = sql_file.read()

        print("Executing script...")
        # executescript allows running multiple commands (CREATE, INSERT, etc.)
        cursor.executescript(sql_script)
        
        conn.commit()
        print("Success! Data imported successfully.")

    except sqlite3.Error as e:
        print(f"SQLite Error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    import_sql()