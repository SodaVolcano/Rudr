""" Route and view function definitions for the main blueprint """
from flask import render_template, redirect, url_for, flash, request, session
from werkzeug.urls import url_parse
from flask_wtf import FlaskForm
from flask_login import login_user, logout_user, current_user
from . import main
from .forms import LoginForm, RegisterForm
from .models import Users
from app import db


@main.route("/", methods=["GET", "POST"])
@main.route("/index", methods=["GET", "POST"])
def index():
    return render_template("index.html")


@main.route("/about")
def about():
    return render_template("about_us.html")

# To logout user
@main.route("/signup")
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
            user = Users(username=register_form.username.data, email=register_form.email.data)
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
