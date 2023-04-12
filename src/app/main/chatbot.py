import random
from time import sleep
from enum import Enum
import os.path

from flask import session, jsonify

from . import main


class CHATBOT_MODE(Enum):
    RANDOM = 0
    CHATGPT = 1


class ChatbotMediator:
    """Mediator class to handle I/O and prompt with the chatbot"""

    def __init__(self) -> None:
        pass

    @staticmethod
    def prompt_chatbot(prompt: str, bot: "ChatbotAgent") -> str:
        """Prompt the chatbot with the given prompt"""
        prompt_structured = ChatbotMediator.__generate_prompt(prompt, bot)
        return bot.prompt(prompt_structured)

    @staticmethod
    def __generate_prompt(message: str, bot: "ChatbotAgent") -> str:
        """Generate a structured prompt for the chatbot"""
        # get personality info and memory etc from bot and add to prompt
        # ... for now, do nothing
        return message


class ChatbotAgent:
    """
    Agent process that converse with a single user, spawned per session
    """

    random_answers_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "random_answers.txt"
    )

    def __init__(self, mode: CHATBOT_MODE = CHATBOT_MODE.RANDOM) -> None:
        self.mode = mode
        self.id = random.randint(0, 100000)

    def prompt(self, prompt: str) -> str:
        """Generate a reply from the chatbot using the given prompt"""
        if self.mode == CHATBOT_MODE.RANDOM:
            return self.__random_reply()
        else:
            return "ERROR: Chatbot mode not implemented yet"

    def __random_reply(self) -> str:
        """Return a random reply from the chatbot, for debugging purposes"""
        sleep(random.uniform(0.25, 3.5))
        lines = open(self.random_answers_path, "r").readlines()
        # Include bot ID for debugging
        return random.choice(lines) + f" (ID: {self.id})"
