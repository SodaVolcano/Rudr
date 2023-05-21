import unittest
from app import create_app, db
from app.main.models import Users, Robot, Conversations, Messages


class TestDBCase(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        print("Setting up...")
        self.app = create_app("testing")
        self.app_context = self.app.app_context()
        self.app_context.push()

        db.create_all()

        # initialise some test data
        user = Users(username="john", email="johnsmith@gmail.com", id=0)
        user.set_password("foo")

        robot = Robot(name="rob", profile_link="", id=0)

        conversation = Conversations(id=0, user_id=0, robot_id=0)

        msg1 = Messages(body="hello", emotion="calm", speaker="user", conversation_ID=0)
        msg2 = Messages(
            body="hello! how are you?",
            emotion="calm",
            speaker="robot",
            conversation_ID=0,
        )
        msg3 = Messages(
            body="good king", emotion="calm", speaker="user", conversation_ID=0
        )
        msg4 = Messages(
            body="foobar!", emotion="calm", speaker="robot", conversation_ID=0
        )

        # add test data
        db.session.add(user)
        db.session.add(robot)
        db.session.add(conversation)
        db.session.add(msg1)
        db.session.add(msg2)
        db.session.add(msg3)
        db.session.add(msg4)

        db.session.commit()

    @classmethod
    def tearDownClass(self):
        print("Tearing down...")
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_password(self):
        user1 = Users()
        user1.set_password("bar")
        self.assertFalse(user1.check_password("dog"))
        self.assertTrue(user1.check_password("bar"))

        user2 = Users()
        user2.set_password("a!@#^&$()!@#")
        self.assertFalse(user2.check_password("dog"))
        self.assertTrue(user2.check_password("a!@#^&$()!@#"))

    def test_query(self):
        user = Users.query.filter_by(id=0).first()
        self.assertTrue(user.username == "john")

    def test_conversation_init(self):
        conv = Conversations.query.filter_by(id=0).first()
        self.assertTrue(conv.user_id == 0)
        self.assertTrue(conv.robot_id == 0)

        msgs = Messages.query.filter_by(conversation_ID=conv.id).all()
        self.assertTrue(len(msgs) == 4)

    def test_methods(self):
        Users.add_user("jeremy", "email@email.com", "foobar")
        user = Users.query.filter_by(username="jeremy").first()
        self.assertIsNotNone(user)
        Robot.add_robot("boltz", "./path", 1234)
        robot = Robot.query.filter_by(id=1234).first()
        self.assertIsNotNone(robot)
        Conversations.add_conversation(1, user.id, robot.id)
        conversation = Conversations.query.filter_by(id=1).first()
        self.assertIsNotNone(conversation)
        Messages.add_msg("NEW WORLD", "SADNESS", "user", 1)
        msg = Messages.query.filter_by(id=5).first()
        self.assertIsNotNone(msg)


if __name__ == "__main__":
    unittest.main(verbosity=2)
