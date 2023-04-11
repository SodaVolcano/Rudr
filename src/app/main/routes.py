""" Route and view function definitions for the main blueprint """
from flask import render_template, redirect, url_for, request, jsonify
from . import main
from .forms import ChatInputForm


@main.route("/")
@main.route("/index")
def index():
    return render_template("index.html")


@main.route("/about")
def about():
    return render_template("about_us.html")


@main.route("/chat", methods=["GET"])
def chat():
    chatbox = ChatInputForm()
    return render_template("chat.html", chatbox=chatbox)


@main.route("/chat", methods=["POST"])
def chat_post():
    message = request.form.get("message")
    print(message)
    return jsonify({"status": "OK", "message": message})
