from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap
from flask_migrate import Migrate

from config import config


bootstrap = Bootstrap()
db = SQLAlchemy()
migrate = Migrate()


def create_app(config_name: str = "default") -> Flask:
    """factory function to create app instance"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    bootstrap.init_app(app)
    db.init_app(app)
    migrate.init_app(app,db)

    
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
