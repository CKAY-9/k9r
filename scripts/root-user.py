"""
    Purpose: 
        A script that allows you to create/reset/delete the root user.
    
    Requirements:
        -> psycopg, datetime, random, os, hashlib packages
        -> enviornment variable "K9R_DATABASE_URL"
"""

import psycopg
import hashlib
import random
import os
import datetime

postgres_url = os.environ.get("K9R_DATABASE_URL")
if postgres_url == None:
    print("Enviornment variable \"K9R_DATABASE_URL\" must be setup before using!")
    exit(1)

print("\n===== K9R Root User Manager =====")

def create_root_user():
    with psycopg.connect(postgres_url) as connection:
        with connection.cursor() as cursor:
            token_string = f"root-root-user{random.randint(0, 100_000_000_00)}{random.randint(0, 100_000_000_00)}{random.randint(0, 100_000_000_00)}"
            token = hashlib.sha256(str.encode(token_string)).hexdigest()
            date = datetime.datetime.now().isoformat()
            
            cursor.execute("SELECT token FROM users WHERE oauth_type='root-root-user'")
            result = cursor.fetchone()
            
            if result != None:
                print(f"Root user already exists. Current token: {result[0]}")
                handle_command()
                return
            
            cursor.execute(f"""
                INSERT INTO users VALUES (
                    DEFAULT,
                    '{token}',
                    'Root',
                    'Root',
                    'No description provided.',
                    '{date}',
                    'root-root-user',
                    '{'{}'}',
                    '{'{}'}',
                    '{'{1, 2}'}',
                    0,
                    '',
                    ''
                )
            """)
            
            cursor.execute("SELECT * FROM users WHERE oauth_type='root-root-user'")
            
            result = cursor.fetchone()
            if result != None:
                print(f"Root user created. Current token: {token}")
                
            handle_command()

def reset_root_token():
    with psycopg.connect(postgres_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE oauth_type='root-root-user'")
            check_result = cursor.fetchone()
            
            if check_result == None:
                print("Root user doesn't exist. Can't reset token.")
                handle_command()
            
            token_string = f"root-root-user{random.randint(0, 100_000_000_00)}{random.randint(0, 100_000_000_00)}{random.randint(0, 100_000_000_00)}"
            token = hashlib.sha256(str.encode(token_string)).hexdigest()

            cursor.execute(f"UPDATE users SET token='{token}' WHERE oauth_type='root-root-user'")
            connection.commit()
            
            print(f"Updated root user token: {token}")
            
            handle_command()

def delete_root_user():
    with psycopg.connect(postgres_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM users WHERE oauth_type='root-root-user'")
            connection.commit()
            
            print("Deleted Root User.")

            handle_command()

def handle_command():
    print("\nAvailable Commands:\n  (0): Quit\n  (1): Create Root User\n  (2): Reset Root User Token\n  (3): Delete Root User")
    option_input = int(input("--> ").rstrip().lower())
    
    print("")
    
    if option_input == 0 or option_input == "":
        exit(0)
        
    if option_input == 1:
        create_root_user()
        
    if option_input == 2:
        reset_root_token()
    
    if option_input == 3:
        delete_root_user()

if __name__ == "__main__":
    handle_command()