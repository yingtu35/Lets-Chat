from flask import Flask, request, Response, session, render_template
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from api.models import db, User, Room, Message
from api.views import api_blueprints
# from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
app.register_blueprint(api_blueprints, url_prefix='/api')
# CORS(app, origins=["http://localhost:3000", "ws://localhost:3000"], supports_credentials=True)
app.config['SECRET_KEY'] = "wkvbh;riqnvrhfgfv"
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:dANiel_092021mysql@127.0.0.1:3306/letschat"
socketio = SocketIO(app, cors_allowed_origins="*")

db.app = app
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

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
    # if user.rid != rid:
    #     return
    
    join_room(rid)
    emit("join", {"username": username, "message": "has enter the room"}, to=rid)
    # send({"username": username, "message": "has enter the room"}, to=room)
    print(f"{username} join the room")
    user.rid = rid
    room.num_users += 1
    db.session.commit()

@socketio.on("disconnect")
def disconnect():
    username = session.get("username")
    # rid = session.get("room")
    # print(f"username: {username} rid: {rid}")
    if not username:
        return
    user = User.query.filter(User.username == username).first()
    if not user or not user.rid:
        return
    rid = user.rid
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        user.rid = None
        db.session.commit()
        return
    # user = User.query.filter(User.username == username).first()
    # if not user:
    #     return
    # if user.rid != rid:
    #     return
    
    leave_room(rid)
    emit("leave", {"username": username, "message": "has left the room"}, to=rid)
    # session.pop("room", None)
    print(f"{username} leave the room")

    # TODO: room should not delete right away, allow room temporarily with 0 users, allow user temporarily have more than one room (with some rooms haven't deleted)
    # TODO: Should write an automated script to delete all rooms with 0 users.
    if user.uid == room.host_uid:
        rid = session.get("room")
        print(f"host {username} left the room {rid}")
        if room.num_users > 1:
            print("Assign a new host")
            users = room.users
            for other_user in users:
                if other_user.uid != room.host_uid:
                    room.host_uid = other_user.uid
                    print(f"new host uid {other_user.uid} assigned")
                    break
            print(f"No user in the room. delete the room")
        # normal procedure, no refresh or closing page
        elif rid: 
            print(f"room {rid} will be deleted")
            db.session.delete(room)
            db.session.commit()
            return
    user.rid = None
    room.num_users -= 1
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
    db.session.commit()

@socketio.on("chat")
def handle_chat(data):
    username = data.get("username")
    message = data.get("message")
    rid = data.get("rid")
    # print("received message:", username, message)
    if not username or not message or not rid:
        return
    room = Room.query.filter(Room.rid == rid).first()
    if not room:
        return
    user = User.query.filter(User.username == username).first()
    if not user:
        return
    if user.rid != rid:
        return
    
    emit("message", {"username": username, "message": message}, to=rid)
    newMessage = Message(
        msg=message,
        createdAt=datetime.now(),
        uid=user.uid,
        rid=room.rid
    )
    db.session.add(newMessage)
    db.session.commit()
    print(f"{username}'s new message successfully added")
        
# Running app
if __name__ == '__main__':
    socketio.run(app, debug=True)