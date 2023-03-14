from passlib.hash import pbkdf2_sha256
from string import ascii_letters, digits
import random
# TODO: hash function to be implemented
def hash_password(password):
    return pbkdf2_sha256.hash(password)
def verify_password(password, hashed_password):
    return pbkdf2_sha256.verify(password, hashed_password)

def generate_room_password(length=6):
    letters_digits = ascii_letters + digits
    password = ""
    for _ in range(length):
        password += random.choice(letters_digits)
    return password