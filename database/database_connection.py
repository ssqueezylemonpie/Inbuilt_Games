import mariadb

try:
    conn = mariadb.connect(
        user="root",
        password="password",
        host="localhost",
        port=3306,
        database="my_database"
    )
    
    cursor = conn.cursor()
    cursor.execute("SELECT NOW()")
    for row in cursor:
        print(row)

except mariadb.Error as e:
    print(f"Error connecting to MariaDB: {e}")

finally:
    if 'conn' in locals() and conn:
        conn.close()
