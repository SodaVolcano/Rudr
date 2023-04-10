""" Route and view function definitions for the main blueprint """
from flask import render_template
from . import main


@main.route("/")
@main.route("/index")
def index():
    return render_template("index.html")


@main.route("/about")
def about():
    return render_template("about_us.html")
