""" Route and view function definitions for the main blueprint """
from flask import render_template, request, jsonify, session
from . import main
from .forms import ChatInputForm
from .chatbot import ChatbotAgent, ChatbotMediator


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


@main.route("/process-msg", methods=["POST"])
def process_msg():
    message = request.form.get("message")
    if message is None:
        return jsonify({"status": "ERROR", "message": "No message provided"}), 400
    if "chatbot" not in session:
        return jsonify({"status": "ERROR", "message": "Chatbot not initialized"}), 400

    reply = ChatbotMediator.prompt_chatbot(message, session["chatbot"])
    return jsonify({"status": "OK", "message": reply})


@main.route("/init_chatbot", methods=["POST"])
def init_chatbot():
    """Initialize the chatbot agent when user starts new session"""
    session["chatbot"] = ChatbotAgent("echo")
    return jsonify({"status": "OK", "bot_id": session["chatbot"].id})
