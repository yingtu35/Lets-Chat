from flask import Flask, request, Response, session, render_template
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import sqlalchemy as sa
from string import ascii_letters, digits
import random

db = SQLAlchemy()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "ws://localhost:3000"], supports_credentials=True)
app.config['SECRET_KEY'] = "wkvbh;riqnvrhfgfv"
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:dANiel_092021mysql@127.0.0.1:3306/letschat"
socketio = SocketIO(app, cors_allowed_origins="*")

db.init_app(app)

# TODO: hash function to be implemented
def hash_password(password):
    return password + "_hashed"
def verify_password(password, hashed_password):
    return (password + "_hashed") == hashed_password

def generate_room_password(length=6):
    letters_digits = ascii_letters + digits
    password = ""
    for _ in range(length):
        password += random.choice(letters_digits)
    return password

# object serializer
class Serializer(object):

    def serialize(self):
        return {c: getattr(self, c) for c in sa.inspect(self).attrs.keys()}

    @staticmethod
    def serialize_list(l):
        return [m.serialize() for m in l]

# define tables
class User(db.Model):
    __tablename__ = "user"
    
    uid = sa.Column(sa.Integer, primary_key=True)
    username = sa.Column(sa.String(30), unique=True, nullable=False, index=True)
    hashed_password = sa.Column(sa.String(255), nullable=False)
    # TODO: email should be indexed for fast lookup
    email = sa.Column(sa.String(255), unique=True, nullable=False)
    birthday = sa.Column(sa.Date, nullable=True)
    rid = sa.Column(sa.Integer, sa.ForeignKey('room.rid', ondelete="SET NULL"), nullable=True)
    
    room = db.relationship("Room", back_populates="users", foreign_keys=[rid])
    messages = db.relationship("Message", back_populates="user")
    
    def serialize(self):
        d = Serializer.serialize(self)
        del d['hashed_password']
        del d['messages']
        del d["room"]
        return d

class Room(db.Model):
    __tablename__ = "room"
    
    rid = sa.Column(sa.Integer, primary_key=True)
    name = sa.Column(sa.String(16), index=True)
    num_users = sa.Column(sa.Integer)
    capacity = sa.Column(sa.Integer)
    password = sa.Column(sa.String(16), nullable=True, default=generate_room_password())
    # ! host_uid should be unique if one user can only create one room
    host_uid = sa.Column(sa.Integer, sa.ForeignKey('user.uid', ondelete="CASCADE"), nullable=False, unique=True)
    
    users = db.relationship("User", back_populates="room", foreign_keys="User.rid")
    messages = db.relationship("Message", back_populates="room")
    
    def serialize(self):
        d = Serializer.serialize(self)
        del d['users']
        del d['messages']
        return d

class Message(db.Model):
    __tablename__ = "message"
    
    msg_id = sa.Column(sa.Integer, primary_key=True)
    msg = sa.Column(sa.String(255), nullable=False)
    createdAt = sa.Column(sa.DateTime, nullable=False)
    uid = sa.Column(sa.Integer, sa.ForeignKey('user.uid'), nullable=False)
    rid = sa.Column(sa.Integer, sa.ForeignKey('room.rid'), nullable=False)
    
    user = db.relationship("User", back_populates="messages")
    room = db.relationship("Room", back_populates="messages")

# Create tables
with app.app_context():
    db.create_all()


@app.route("/home")
def home():
    session["test"] = "cookie test"
    return {
        'name': "Ying Tu",
        'msg': "Hello World"
    }
    
@app.route('/signin', methods=["POST"])
def signin():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return {"error": "invalid data form"}
    
    user = User.query.filter(User.username == username).first()
    if not user:
        return Response({"error": "invalid username or password"}, status=404)
    
    if not verify_password(password, user.hashed_password): 
        return Response({"error": "invalid username or password"}, status=404)
    
    session["username"] = user.username
    user = user.serialize()
    return user

@app.route('/logout', methods=["POST"])
def logout():
    username = session.get("username")
    if not username:
        return Response("Invalid logout", status=404)
    session.pop("username", None)
    return Response("Log out success", status=200)
    

@app.route('/signup', methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    birthday = data.get("birthday", None)
    
    queryset = User.query.filter(User.email == email).first()
    if queryset:
        return Response({"error": "Email has been used by other users"}, status=404)
    
    queryset = User.query.filter(User.username == username).first()
    if queryset:
        return Response({"error": "Username has been used by other users"}, status=404)
    
    new_user = User(username=username, 
                    hashed_password=hash_password(password),
                    email=email,
                    birthday=birthday)
    db.session.add(new_user)
    db.session.commit()
    user = User.query.filter(User.username == username).first().serialize()
    return user

@app.route("/users", methods=['GET'])
def users():
    users = User.query.filter(User.uid <= 10).all()
    users = Serializer.serialize_list(users)
    return users

@app.route("/user/auth", methods=['GET'])
def user_auth():
    username = session.get('username')
    if not username:
        return Response("Unauthenticated", status=404)
    user = User.query.filter(User.username == username).first()
    if not user:
        return Response("Unauthenticated", status=404)
    user = user.serialize()
    return user

@app.route("/rooms", methods=['GET'])
def rooms():
    rooms = Room.query.all()
    rooms = Serializer.serialize_list(rooms)
    return rooms

@app.route("/room", methods=['POST'])
def create_room():
    data = request.get_json()
    username = data.get("username")
    room = data.get("room")
    if not username or not room:
        return Response("Invalid data form", status=400)

    # get the host id
    user = User.query.filter(User.username == username).first()
    if not user:
        Response(f"Username {username} not found", status=404)
    
    if user.rid:
        print(f"User already has a room {user.rid}")
        return Response(f"User already has a room {user.rid}", status=400)

    new_room = Room(name=room,
                    num_users=1,
                    capacity=16, 
                    host_uid=user.uid)
    db.session.add(new_room)
    db.session.commit()
    
    room = Room.query.filter(Room.host_uid == user.uid).first()
    user.rid = room.rid
    db.session.commit()
    
    session["room"] = room.rid
    room = room.serialize()
    return room

@app.route("/room-join", methods=['POST'])
def room_join():
    data = request.get_json()
    username = data.get("username")
    rid = data.get("rid")
    if not username or not rid:
        return Response("Invalid data form", status=400)
    
    # get the user
    user = User.query.filter(User.username == username).first()
    if not user:
        return Response(f"User {username} not found", status=404)
    # check if user is already in the room
    if user.rid is not None:
        return Response(f"Problem occurs joining room", status=400)
    
    # get the room
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        return Response(f"Room {rid} not found", status=404)
    
    # check if room reach maximum capacity
    if room.num_users >= room.capacity:
        return Response(f"Room {rid} already full", status=400)
    user.rid = room.rid
    room.num_users += 1
    db.session.commit()
    
    session["room"] = room.rid
    room = room.serialize()
    return room

@app.route("/room-leave", methods=['POST'])
def room_leave():
    data = request.get_json()
    username = data.get("username")
    rid = data.get("rid")
    if not username or not rid:
        return Response("Invalid data form", status=400)
    
    # get the user
    user = User.query.filter(User.username == username).first()
    if not user:
        return Response(f"User {username} not found", status=404)
    # check if user is not in the correct room
    if user.rid is None or user.rid != rid:
        return Response(f"Problem occurs leaving room", status=400)
    
    # get the room
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        return Response(f"Room {rid} not found", status=404)
    
    # TODO: Testing on every branch
    # user is not the host
    if user.uid != room.host_uid:
        user.rid = None
        room.num_users -= 1
    # user is host, assign another user as host
    elif room.num_users > 1:
        users = room.users
        for user in users:
            if user.uid != room.host_uid:
                room.host_uid = user.uid
                break
        user.rid = None
        room.num_users -= 1
    # user is host, delete the whole room
    else:
        db.session.delete(room)
    db.session.commit()
    session.pop("room", None)
    return Response(f"Leave Room Success", status=200)

@app.route("/user-in-room", methods=['POST'])
def user_in_room():
    username = session.get("username")
    if not username:
        return Response(f"You are not logined", status=400)
    
    # get the user
    user = User.query.filter(User.username == username).first()
    if not user:
        return Response(f"User {username} not found", status=404)
    if user.rid is None:
        return Response(f"User not in any room", status=404)
    room = user.room
    
    session["room"] = room.rid
    room = room.serialize()
    return room

@app.route("/room/users", methods=['GET'])
def users_in_room():
    username = session.get("username")
    rid = session.get("room")
    if not username or not rid:
        return Response(f"You are not loggined or in the room", status=400)
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        return Response(f"Room {rid} not found", status=404)
    user = User.query.filter(User.username == username).first()
    if not user:
        return Response(f"User {username} not found", status=404)
    if user.rid != rid:
        return Response(f"You are not in room {rid}", status=403)
    
    # Get all usernames
    users = [user.username for user in room.users]
    return users
    
    
@socketio.on("connect")
def connect():

    username = session.get("username")
    rid = session.get("room")
    if not username or not rid:
        return
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        return
    user = User.query.filter(User.username == username).first()
    if not user:
        return
    
    join_room(rid)
    emit("join", {"username": username, "message": "has enter the room"}, to=rid)
    # send({"username": username, "message": "has enter the room"}, to=room)
    print(f"{username} join the room")
    # TODO: Should add room number of users?

@socketio.on("disconnect")
def disconnect():
    username = session.get("username")
    rid = session.get("room")
    if not username or not rid:
        return
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        return
    
    leave_room(rid)
    emit("leave", {"username": username, "message": "has left the room"}, to=rid)
    # send({"username": username, "message": "has left the room"}, to=room)
    print(f"{username} leave the room")
    # TODO: Should decrease room number of users?

@socketio.on("chat")
def handle_chat(data):
    username = data.get("username")
    message = data.get("message")
    rid = data.get("rid")
    # print("received message:", username, message)
    if not username or not message or not rid:
        return
    
    emit("message", {"username": username, "message": message}, to=rid)
    # TODO: append messages to the database
        
    


    
    
        
        

# Running app
if __name__ == '__main__':
    socketio.run(app, debug=True)