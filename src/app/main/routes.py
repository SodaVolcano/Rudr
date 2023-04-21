""" Route and view function definitions for the main blueprint """

from flask import render_template, redirect, url_for, flash, request, session, jsonify
from werkzeug.urls import url_parse
from flask_login import login_user, logout_user

from . import main
from .forms import LoginForm, RegisterForm
from .models import Users
from .chatbot import ChatbotAgent, ChatbotMediator
import json

from app import db


@main.route("/", methods=["GET", "POST"])
@main.route("/index", methods=["GET", "POST"])
def index():
    return render_template("index.html")


@main.route("/about")
def about():
    return render_template("about_us.html")


@main.route("/chat", methods=["GET"])
def chat():
    return render_template("chat.html")


@main.route("/process-msg", methods=["POST"])
def process_msg():
    messages = request.form.get("messages")
    print(messages)
    if messages is None:
        return jsonify({"status": "ERROR", "message": "No message provided"}), 400
    if "chatbot" not in session:
        return jsonify({"status": "ERROR", "message": "Chatbot not initialized"}), 400

    messages = json.loads(messages)
    reply = ChatbotMediator.prompt_chatbot(messages, session["chatbot"])
    return jsonify({"status": "OK", "messages": reply})


@main.route("/init_chatbot", methods=["POST"])
def init_chatbot():
    """Initialize the chatbot agent when user starts new session"""
    session["chatbot"] = ChatbotAgent("random")
    return jsonify({"status": "OK", "bot_id": session["chatbot"].id})


# To logout user
@main.route("/signup", methods=["GET", "POST"])
def signup():
    register_form = RegisterForm()
    if register_form.validate_on_submit():
        # parse registration information
        flash(
            "Logged in: "
            + register_form.username.data
            + ", "
            + register_form.password.data
        )
        # Login user
        user = Users(
            username=register_form.username.data, email=register_form.email.data
        )
        user.set_password(register_form.password.data)

        db.session.add(user)
        db.session.commit()
        return redirect(url_for(".login"))
    return render_template("signup.html", form=register_form)


# To logout user
@main.route("/login", methods=["GET", "POST"])
def login():
    login_form = LoginForm()
    if login_form.validate_on_submit():
        # parse login information
        flash(
            "Logged in: " + login_form.username.data + ", " + login_form.password.data
        )
        user = Users.query.filter_by(username=login_form.username.data).first()
        if user is None or not user.check_password(login_form.password.data):
            flash("Invalid username or password")
            return redirect(url_for(".index"))
        login_user(user, remember=login_form.remember_me.data)
        next_page = request.args.get("next")
        if not next_page or url_parse(next_page).netloc != "":
            next_page = url_for(".index")
        return redirect(next_page)
    return render_template("login.html", form=login_form)


# To logout user
@main.route("/logout")
def logout():
    logout_user()
    return redirect(url_for(".index"))
