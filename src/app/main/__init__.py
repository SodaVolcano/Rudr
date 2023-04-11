"""
    Initialise blueprints for main app - manages routes
"""

from flask import Blueprint


main = Blueprint("main", __name__)

# Avoid circular imports and to register routes to main
from . import routes, models
