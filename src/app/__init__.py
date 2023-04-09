
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager


from .config import Config



#App config

app = Flask(__name__)
app.config.from_object(Config)

# Database setup

db = SQLAlchemy(app)
migrate = Migrate(app,db)

#Login Manager
login = LoginManager(app)
login.login_view = 'login'

from app import routes, models
