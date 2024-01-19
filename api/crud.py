from .models import db, Serializer, User, Room
from .utils import hash_password

def getUser(username):
    return User.query.filter(User.username == username).first()

def getUserByEmail(email):
    return User.query.filter(User.email == email).first()

def getFirstNUsers(n):
    users = User.query.filter(User.uid <= n).all()
    users = Serializer.serialize_list(users)
    return users

def createUser(username, password, email, birthday=None):
    new_user = User(username=username, 
                    hashed_password=hash_password(password),
                    email=email,
                    birthday=birthday)
    db.session.add(new_user)
    db.session.commit()
    # ? return new_user or query the user again
    new_user = new_user.serialize()
    return new_user

def getRooms():
    rooms = Room.query.all()
    rooms = Serializer.serialize_list(rooms)
    return rooms

def createRoom(name, capacity, host_uid, num_users=0):
    new_room = Room(name=name,
                    num_users=num_users,
                    capacity=capacity, 
                    host_uid=host_uid)
    db.session.add(new_room)
    db.session.commit()
    new_room = new_room.serialize()
    return new_room

def getRoomById(rid):
    return Room.query.filter(Room.rid == rid).first()
