from app import db, login
from datetime import datetime
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash


# For login manager
@login.user_loader
def load_user(id):
    return Users.query.get(int(id))


# User Table
class Users(UserMixin, db.Model):
    # Primary key
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)

    # Encrypted password
    password_hash = db.Column(db.String(128))

    # Relationship
    conversations = db.relationship("Conversations", backref="user", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return "<User {}>".format(self.username)

    # Add new user to database
    def add_user(username, email, password):
        user = Users(username=username, email=email)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()


class Robot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    profile_link = db.Column(db.String(100))
    conversations = db.relationship("Conversations", backref="robot", lazy="dynamic")

    # Add new robot to database
    def add_robot(name, profile_link):
        robot = Robot(name=name, profile_link=profile_link)

        db.session.add(robot)
        db.session.commit()


class Conversations(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    robot_id = db.Column(db.Integer, db.ForeignKey("robot.id"))

    messages = db.relationship("Messages", backref="conversation", lazy="dynamic")

    # add new conversation
    def add_conversation(id: int, user_id: int, robot_id: int):
        conversation = Conversations(
            id=id,
            user_id=user_id,
            robot_id=robot_id,
        )
        # Add new message to database
        db.session.add(conversation)
        db.session.commit()

    # check if conversation exists
    def conversation_exists(self, id):
        conversation = Conversations.query.filter_by(id=id).first()
        return conversation is not None


# Message Table
class Messages(db.Model):
    # Message ID
    id = db.Column(db.Integer, primary_key=True)

    # Actual message
    body = db.Column(db.String(140))

    # Which conversation it belongs to, contains userID's and RobotID's
    conversation_ID = db.Column(db.Integer, db.ForeignKey("conversations.id"))

    # Speaker Declaration, whether it's user or robot
    speaker = db.Column(db.String(20), nullable=False)

    # Emotion attached to message
    emotion = db.Column(db.String(30))

    # Index of emotion
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    # Ensures that the speaker is either user or robot
    __table_args__ = (
        db.CheckConstraint(
            speaker.in_(["user", "robot"]), name="ensure_correct_speaker"
        ),
    )

    def __repr__(self):
        return "<Post {}>".format(self.body)
        # Add new message

    def add_msg(content: str, emote: str, speaker: str, conversationID: int):
        message = Messages(
            body=content,
            emotion=emote,
            speaker=speaker,
            conversation_ID=conversationID,
        )
        # Add new message to database
        db.session.add(message)
        db.session.commit()

    # Get a certain amount of messages from the database, from a given conversation, in chronological order
    def get_messages(conversation: Conversations, amount: int):
        msgs = (
            Messages.query.order_by(Messages.timestamp)
            .filter_by(conversation_ID=conversation.id)
            .limit(amount)
            .all()
        )
        return msgs
