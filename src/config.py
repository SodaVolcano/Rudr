""" Sample configuration file, change as needed """
import os

from flask import Flask


basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    """Settings common to all configurations"""

    SECRET_KEY = os.environ.get("SECRET_KEY") or "you-will-never-guess"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    @staticmethod
    def init_app(app: Flask):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DEV_DATABASE_URL"
    ) or "sqlite:///" + os.path.join(basedir, "data-dev.sqlite")


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("TEST_DATABASE_URL") or "sqlite:///"


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URL = os.environ.get(
        "DATABASE_URL"
    ) or "sqlite:///" + os.path.join(basedir, "data.sqlite")


config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
