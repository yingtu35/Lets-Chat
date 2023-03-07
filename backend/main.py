from flask import Flask, request, Response, session, render_template
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from string import ascii_letters, digits
import random

db = SQLAlchemy()

app = Flask(__name__)
app.config['SECRET_KEY'] = "wkvbh;riqnvrhfgfv"
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:dANiel_092021mysql@127.0.0.1:3306/letschat"
socketio = SocketIO(app)

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
    
    user = user.serialize()
    return user

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

@app.route("/rooms", methods=['GET'])
def rooms():
    rooms = Room.query.all()
    rooms = Serializer.serialize_list(rooms)
    return rooms

@app.route("/room", methods=['POST'])
def room():
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
    
    room = room.serialize()
    return room

# Running app
if __name__ == '__main__':
    socketio.run(app, debug=True)