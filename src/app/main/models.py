from app import db
from datetime import datetime
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy


class Users(UserMixin, db.Model):
    # Primary key
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)

    # Ideally, images should be stored in a third party service if scaled.
    profile_picture = db.Column(db.LargeBinary)

    #Encrypted password
    password_hash = db.Column(db.String(128))

    def __repr__(self):
        return '<User {}>'.format(self.username)
    
class Messages(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Post {}>'.format(self.body)