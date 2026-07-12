import sqlite3
import os

db_path = "ecosphere.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("DROP INDEX IF EXISTS ix_notifications_user_id;")
    cur.execute("DROP INDEX IF EXISTS ix_notifications_is_read;")
    cur.execute("DROP TABLE IF EXISTS notifications;")
    conn.commit()
    conn.close()
    print("Dropped notifications table and indexes successfully.")
else:
    print("DB not found.")
