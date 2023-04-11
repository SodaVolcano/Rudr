""" Route and view function definitions for the main blueprint """
from flask import render_template, redirect, url_for, flash, request
from werkzeug.urls import url_parse
from flask_login import login_user, logout_user
from . import main
from .forms import LoginForm, RegisterForm
from .models import Users
from app import db



@main.route("/", methods=['GET','POST'])
@main.route("/index", methods=['GET','POST'])
def index():
    login_form = LoginForm()
    register_form = RegisterForm()
    if login_form.validate_on_submit():
        # parse login information
        user = Users.query.filter_by(username=login_form.username.data).first()
        if user is None or not user.check_password(login_form.password.data):
            flash("Invalid username or password")
            return redirect(url_for("login"))
        login_user(user, remember=login_form.remember_me.data)
        next_page = request.args.get("next")
        if not next_page or url_parse(next_page).netloc != "":
            next_page = url_for("index")
        return redirect(next_page)

    if register_form.validate_on_submit():
        # parse registration information
        user = Users(username=register_form.username, email=register_form.email)
        user.set_password(register_form.password)
        db.session.add(user)
        db.session.commit()

        # Login user
        login_user(user, remember=register_form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('main.index')
        return redirect(next_page)
    return render_template("index.html", login=login_form, register=register_form)


@main.route("/about")
def about():
    return render_template("about_us.html")


# To logout user
@main.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))
