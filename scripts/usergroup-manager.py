"""
    Purpose: 
        A simple helper script to add/remove users from usergroups. It is recommended 
        to do this through the root user login; however, this works too.
    
    Requirements:
        -> psycopg, os packages
        -> enviornment variable "K9R_DATABASE_URL"
"""

import psycopg
import os

postgres_url = os.environ.get("K9R_DATABASE_URL")
if postgres_url == None:
    print("Enviornment variable \"K9R_DATABASE_URL\" must be setup before using!")
    exit(1)

print("\n===== K9R Usergroup Manager =====")

def list_usergroups():
    with psycopg.connect(postgres_url) as connection:
        with connection.cursor() as cursor:
            
            cursor.execute("SELECT * FROM usergroups")
            usergroups = cursor.fetchall()
            
            print("All Usergroups:")
            for usergroup in usergroups:
                print(f"ID: {usergroup[0]}, Name: {usergroup[1]}, Color: {usergroup[2]}, Icon: {usergroup[3]}, Permissions: {usergroup[4]}")
            
    
    handle_command()

def add_user_to_usergroup():
    user_id = int(input("Enter user's ID --> "))
    usergroup_id = int(input("Enter usergroup ID --> "))
    
    with psycopg.connect(postgres_url) as connection:
        with connection.cursor() as cursor:
            
            cursor.execute(f"SELECT username, usergroups FROM users WHERE id='{user_id}'")
            user_result = cursor.fetchone()
            if user_result == None:
                print("Failed to get user with specified ID")
                add_user_to_usergroup()
                return

            confirm_input = input(f"Found user with name {user_result[0]}, is this correct (y/n) --> ").rstrip().lower()
            
            if "n" in confirm_input:
                print("")
                add_user_to_usergroup()
                return
            
            cursor.execute(f"SELECT name FROM usergroups WHERE id='{usergroup_id}'")
            usergroup_result = cursor.fetchone()
            if usergroup_result == None:
                print("Failed to get usergroup with specified ID")
                print("")
                add_user_to_usergroup()
                return

            confirm_input = input(f"Found usergroup with name {usergroup_result[0]}, is this correct (y/n) --> ").rstrip().lower()
            
            if "n" in confirm_input:
                print("")
                add_user_to_usergroup()
                return
            
            print(f"Adding {usergroup_result[0]} to {user_result[0]}'s usergroups...")
            usergroups: list = user_result[1]

            if usergroup_id in usergroups:
                print("User already in usergroup. Skipping")
                handle_command()
                return
            
            usergroups.append(usergroup_id)
            
            cursor.execute(f"UPDATE users SET usergroups=ARRAY{usergroups} WHERE id='{user_id}'")
            
            print("Updated usergroups!")
    
    handle_command()
    
def remove_user_from_usergroup():
    user_id = int(input("Enter user's ID --> "))
    
    with psycopg.connect(postgres_url) as connection:
        with connection.cursor() as cursor:
            
            cursor.execute(f"SELECT username, usergroups FROM users WHERE id='{user_id}'")
            user_result = cursor.fetchone()
            if user_result == None:
                print("Failed to get user with specified ID")
                add_user_to_usergroup()
                return

            confirm_input = input(f"Found user with name {user_result[0]}, is this correct (y/n) --> ").rstrip().lower()
            
            if "n" in confirm_input:
                print("")
                add_user_to_usergroup()
                return

def handle_command():
    print("\nAvailable Commands:\n  (0): Quit\n  (1): List Usergroups\n  (2): Add user to usergroup by IDs\n  (3): Remove user from usergroup by IDs")
    option_input = int(input("--> ").rstrip().lower())
    
    print("")
    
    if option_input == 0 or option_input == "":
        exit(0)

    if option_input == 1:
        list_usergroups()
        
    if option_input == 2:
        add_user_to_usergroup()
        
    if option_input == 3:
        remove_user_from_usergroup()

if __name__ == "__main__":
    handle_command()