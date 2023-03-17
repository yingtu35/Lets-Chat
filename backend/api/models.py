from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from .utils import generate_room_password

db = SQLAlchemy()

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
    email = sa.Column(sa.String(255), unique=True, nullable=False, index=True)
    google_sub = sa.Column(sa.String(255), unique=True, nullable=True)
    birthday = sa.Column(sa.Date, nullable=True)
    rid = sa.Column(sa.Integer, sa.ForeignKey('room.rid', ondelete="SET NULL"), nullable=True)
    
    room = db.relationship("Room", back_populates="users", foreign_keys=[rid])
    messages = db.relationship("Message", back_populates="user")
    
    def serialize(self):
        d = Serializer.serialize(self)
        del d['hashed_password']
        del d['messages']
        del d["room"]
        del d["google_sub"]
        return d

class Room(db.Model):
    __tablename__ = "room"
    
    rid = sa.Column(sa.Integer, primary_key=True)
    name = sa.Column(sa.String(16), index=True)
    num_users = sa.Column(sa.Integer)
    capacity = sa.Column(sa.Integer)
    password = sa.Column(sa.String(16), nullable=True, default=generate_room_password())
    # ! host_uid is not unique because temporarily there could be empty room to be deleted
    host_uid = sa.Column(sa.Integer, sa.ForeignKey('user.uid', ondelete="CASCADE"), nullable=False)
    
    users = db.relationship("User", back_populates="room", foreign_keys="User.rid")
    messages = db.relationship("Message", back_populates="room", cascade="all, delete", passive_deletes=True)
    
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
    # ! When room is deleted, messages are not deleted
    uid = sa.Column(sa.Integer, sa.ForeignKey('user.uid', ondelete="SET NULL"), nullable=True)
    rid = sa.Column(sa.Integer, sa.ForeignKey('room.rid', ondelete="CASCADE", onupdate="CASCADE"), nullable=True)
    
    user = db.relationship("User", back_populates="messages")
    room = db.relationship("Room", back_populates="messages")
    
    def serialize(self):
        d = Serializer.serialize(self)
        d['username'] = d['user'].username
        del d['user']
        del d['room']
        return d