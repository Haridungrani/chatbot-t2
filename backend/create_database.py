"""
Script to create the PostgreSQL database for the chatbot application
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Database connection parameters
DB_HOST = "localhost"
DB_PORT = "5432"
DB_USER = "postgres"
DB_PASSWORD = "postgres"  # Update with your PostgreSQL password
DB_NAME = "chatbot_db1"

def create_database():
    try:
        # Connect to PostgreSQL server (default 'postgres' database)
        print(f"Connecting to PostgreSQL server at {DB_HOST}:{DB_PORT}...")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database="postgres"  # Connect to default database
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'")
        exists = cursor.fetchone()
        
        if exists:
            print(f"✅ Database '{DB_NAME}' already exists!")
        else:
            # Create database
            print(f"Creating database '{DB_NAME}'...")
            cursor.execute(f"CREATE DATABASE {DB_NAME}")
            print(f"✅ Database '{DB_NAME}' created successfully!")
        
        cursor.close()
        conn.close()
        
        print("\n🚀 You can now start your FastAPI server:")
        print("   uvicorn main:app --reload")
        
    except psycopg2.OperationalError as e:
        print(f"\n❌ Connection Error:")
        print(f"   {e}")
        print("\n📝 Troubleshooting:")
        print("   1. Make sure PostgreSQL is running")
        print("   2. Check your username and password")
        print("   3. Verify PostgreSQL is listening on port 5432")
        print(f"   4. Update DB_PASSWORD in this script if needed")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    create_database()
