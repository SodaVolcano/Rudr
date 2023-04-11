from app import db, login
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class Users(UserMixin, db.Model):
    # Primary key
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)

    # Encrypted password
    password_hash = db.Column(db.String(128))

    # Relationship
    messages = db.relationship("Messages", backref="author", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return "<User {}>".format(self.username)

# For login manager
@login.user_loader
def load_user(id):
    return Users.query.get(int(id))

class Messages(db.Model):
    # Message ID
    id = db.Column(db.Integer, primary_key=True)

    # Actual message
    body = db.Column(db.String(140))
    speakerID = db.Column(db.Integer)

    # Emotion attached to message
    emotion = db.Column(db.String(30))

    # Index of emotion
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    # Author of message
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))

    def __repr__(self):
        return "<Post {}>".format(self.body)
