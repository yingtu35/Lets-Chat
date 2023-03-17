from flask import Blueprint, request, session, Response
from .models import db, Serializer, User, Room
from .utils import verify_password, hash_password
from google.oauth2 import id_token
from google.auth.transport.requests import Request
api_blueprints = Blueprint('api', __name__)

CLIENT_ID = "366291414162-ttot02sq80dmapdd42l8ns8trk77q30e.apps.googleusercontent.com"
@api_blueprints.route("/home")
def home():
    return {
        'owner': "Ying Tu",
        'msg': "Hello World"
    }

# TODO: GitHub sign in
    
@api_blueprints.route('/session/google', methods=["POST"])
def google_login():
    data = request.get_json()
    # print(data)
    token = data['credential']
    try:
        id_info = id_token.verify_oauth2_token(token, Request(), CLIENT_ID)
        print(id_info)
        email = id_info["email"]
        sub = id_info["sub"]
        # TODO: can save picture and display in the page
        # find user with this email
        user = User.query.filter(User.email == email).first()
        if not user:
            return Response("invalid username or password", status=404)
        if user.google_sub and user.google_sub != sub:
            return Response("invalid username or password", status=404)
        if not user.google_sub:
            user.google_sub = sub
            db.session.commit()
            
        session["username"] = user.username
        user = user.serialize()
        return user
    except:
        print("Google sign in verification failed")
        return Response("invalid username or password", status=404)
    
@api_blueprints.route('/session', methods=["POST"])
def signin():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return Response("invalid data form", status=400)
    
    user = User.query.filter(User.username == username).first()
    if not user:
        return Response("invalid username or password", status=404)
    
    if not verify_password(password, user.hashed_password): 
        return Response("invalid username or password", status=404)
    
    session["username"] = user.username
    user = user.serialize()
    return user

@api_blueprints.route('/session', methods=["DELETE"])
def logout():
    username = session.get("username")
    if not username:
        return Response("Invalid logout", status=404)
    session.pop("username", None)
    return Response("Log out success", status=200)
    

@api_blueprints.route('/users', methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    birthday = data.get("birthday")
    # TODO: should validate email and birthday format
    birthday = None if birthday == "" else birthday
    
    if not username or not password or not email:
         return Response("invalid data form", status=400) 
    
    queryset = User.query.filter(User.email == email).first()
    if queryset:
        return Response("Email has been used by other users", status=404)
    
    queryset = User.query.filter(User.username == username).first()
    if queryset:
        return Response("Username has been used by other users", status=404)
    
    new_user = User(username=username, 
                    hashed_password=hash_password(password),
                    email=email,
                    birthday=birthday)
    db.session.add(new_user)
    db.session.commit()
    session["username"] = username
    user = User.query.filter(User.username == username).first().serialize()
    return user

@api_blueprints.route("/users", methods=['GET'])
def users():
    users = User.query.filter(User.uid <= 10).all()
    users = Serializer.serialize_list(users)
    return users

@api_blueprints.route("/user/auth", methods=['GET'])
def user_auth():
    username = session.get('username')
    if not username:
        return Response("Unauthenticated", status=401)
    user = User.query.filter(User.username == username).first()
    if not user:
        session.pop("username")
        session.pop("room")
        return Response("Unauthenticated", status=401)
    user = user.serialize()
    return user

@api_blueprints.route("/rooms", methods=['GET'])
def rooms():
    username = session.get('username')
    if not username:
        return Response("Unauthenticated", status=401)
    user = User.query.filter(User.username == username).first()
    if not user:
        session.pop('username', None)
        return Response("Unauthenticated", status=401)
    
    rooms = Room.query.all()
    rooms = Serializer.serialize_list(rooms)
    return rooms

@api_blueprints.route("/rooms", methods=['POST'])
def create_room():
    login_username = session.get("username")
    data = request.get_json()
    username = data.get("username")
    print(login_username, username)
    room = data.get("room")
    if not login_username or login_username != username:
        # clear cookies
        session.pop('username', None)
        session.pop('room', None)
        return Response("Unauthenticated", status=401)
    
    if not username or not room:
        return Response("Invalid data form", status=404)
    
    # get the host id
    user = User.query.filter(User.username == username).first()
    if not user:
        # clear cookies
        session.pop('username', None)
        session.pop('room', None)
        return Response(f"Username {username} not found", status=401)
    
    if user.rid:
        print(f"User already has a room {user.rid}")
        # clear cookies
        session.pop('username', None)
        session.pop('room', None)
        # ! Should user be kicked out of the room? what if user is the host of the room
        return Response(f"User already has a room {user.rid}. Please signin again", status=400)

    new_room = Room(name=room,
                    num_users=0,
                    capacity=16, 
                    host_uid=user.uid)
    db.session.add(new_room)
    db.session.commit()
    
    room = Room.query.filter(Room.host_uid == user.uid).first()
    # user.rid = room.rid
    # db.session.commit()
    
    session["room"] = room.rid
    room = room.serialize()
    return room

@api_blueprints.route("/rooms/<int:rid>", methods=['GET'])
def show_room(rid):
    username = session.get('username')
    if not username:
        return Response("Unauthenticated", status=401)
    user = User.query.filter(User.username == username).first()
    if not user:
        return Response("Unauthenticated", status=401)
    
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        return Response(f"Room {rid} not found", status=404)
        
    room = room.serialize()
    return room

@api_blueprints.route("/rooms/<string:username>", methods=['POST'])
def room_join(username):
    login_username = session.get("username")
    data = request.get_json()
    # username = data.get("username")
    rid = data.get("rid")
    if not login_username or login_username != username:
        # clear cookies
        session.pop('username', None)
        session.pop('room', None)
        return Response("Unauthenticated", status=401)
    
    if not rid:
        return Response("Invalid data form", status=404)
    
    # get the user
    user = User.query.filter(User.username == username).first()
    if not user:
        # clear cookies
        session.pop('username', None)
        session.pop('room', None)
        return Response(f"User {username} not found", status=401)
    # check if user is already in the room
    if user.rid is not None:
        print(f"User already has a room {user.rid}")
        # clear cookies
        session.pop('username', None)
        session.pop('room', None)
        # ! Should user be kicked out of the room? what if user is the host of the room
        return Response(f"User already has a room {user.rid}. Please signin again", status=400)
    
    # get the room
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        return Response(f"Room {rid} not found or has been deleted", status=404)
    
    # check if room reach maximum capacity
    if room.num_users >= room.capacity:
        return Response(f"Room {rid} already full. Try again later", status=403)
    # TODO: should move to connect, at the cost of every page refresh will cause a database write
    # user.rid = room.rid
    # room.num_users += 1
    # db.session.commit()
    
    session["room"] = room.rid
    room = room.serialize()
    return room

@api_blueprints.route("/rooms/<string:username>", methods=['DELETE'])
def room_leave(username):
    login_username = session.get("username")
    # username = session.get("username")
    rid = session.get("room")
    if not login_username or login_username != username:
        # clear cookies
        session.pop('username', None)
        session.pop('room', None)
        return Response("Unauthenticated", status=401)
    if not rid:
        return Response(f"Room {rid} not found", status=404)
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        session.pop('room', None)
        return Response(f"Room {rid} not found", status=404)
    user = User.query.filter(User.username == username).first()
    if not user:
        # clear cookies
        session.pop('username', None)
        session.pop('room', None)
        return Response(f"User {username} not found. Please signin again", status=401)
    if user.rid != rid:
        session.pop('room', None)
        return Response(f"You are not in room {rid}", status=403)
    
    # TODO: should move to disconnect, at the cost of every page refresh will cause a database write
    # # user is not the host
    # if user.uid != room.host_uid:
    #     user.rid = None
    #     room.num_users -= 1
    # # user is host, assign another user as host
    # elif room.num_users > 1:
    #     users = room.users
    #     for other_user in users:
    #         if other_user.uid != room.host_uid:
    #             room.host_uid = other_user.uid
    #             break
    #     user.rid = None
    #     room.num_users -= 1
    # # user is host, delete the whole room
    # else:
    #     db.session.delete(room)
    # db.session.commit()
    session.pop("room", None)
    return Response(f"Leave Room Success", status=200)

@api_blueprints.route("/rooms/<string:username>", methods=['GET'])
def user_in_room(username):
    login_username = session.get("username")
    rid = session.get("room")
    # username = session.get("username")
    if not login_username or login_username != username:
        # clear cookies
        session.pop('username', None)
        session.pop('room', None)
        return Response(f"Unauthenticated", status=401)
    
    # get the user
    user = User.query.filter(User.username == username).first()
    if not user:
        # clear cookies
        session.pop('username', None)
        session.pop('room', None)
        return Response(f"User {username} not found", status=401)
    if not rid:
        return Response(f"User not in any room", status=404)
    if user.rid is not None:
        user.rid = None
        db.session.commit()
        # return Response(f"User not in any room", status=404)
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        session.pop("room")
        return Response(f"Room {rid} not found or has been deleted", status=404)
    
    # check if room reach maximum capacity
    if room.num_users >= room.capacity:
        session.pop("room")
        return Response(f"Room {rid} already full. Try join it again", status=403)
        
    # session["room"] = room.rid
    room = room.serialize()
    return room

# TODO: Should combine users_in_room and room_messages into one endpoint
@api_blueprints.route("/room/users", methods=['GET'])
def users_in_room():
    username = session.get("username")
    rid = session.get("room")
    # TODO: should clear rid
    if not username:
        session.pop('room', None)
        return Response(f"You are not loggined. please signin again", status=401)
    if not rid:
        session.pop("room", None)
        return Response(f"Room {rid} not found", status=404)
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        session.pop("room", None)
        return Response(f"Room {rid} not found", status=404)
    user = User.query.filter(User.username == username).first()
    if not user:
        session.pop("username")
        session.pop('room', None)
        return Response(f"User {username} not found. please signin again", status=401)
    # if user.rid != rid:
    #     return Response(f"You are not in room {rid}", status=403)
    
    # Get all usernames
    users = [user.username for user in room.users]
    return users

@api_blueprints.route("/room/messages", methods=['GET'])
def room_messages():
    username = session.get("username")
    rid = session.get("room")
    # TODO: should clear cookies
    if not username:
        session.pop('room', None)
        return Response(f"You are not loggined. please signin again", status=401)
    if not rid:
        session.pop("room", None)
        return Response(f"Room {rid} not found", status=404)
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        session.pop("room", None)
        return Response(f"Room {rid} not found", status=404)
    user = User.query.filter(User.username == username).first()
    if not user:
        session.pop("username")
        session.pop('room', None)
        return Response(f"User {username} not found. please signin again", status=401)
    # if user.rid != rid:
    #     return Response(f"You are not in room {rid}", status=403)
    
    # Get all messages
    messages = Serializer.serialize_list(room.messages)
    return messages