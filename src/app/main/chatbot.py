import random
from time import sleep
from enum import Enum

from main import main


class CHATBOT_MODE(Enum):
    RANDOM = 0
    CHATGPT = 1


class ChatbotMediator:
    """Mediator class to handle I/O and prompt with the chatbot"""

    def __init__(self) -> None:
        pass


class ChatbotAgent:
    """
    Agent process that converse with a single user, spawned per session
    """

    random_answers_path = "./random_answers.txt"

    def __init__(self, mode: CHATBOT_MODE = CHATBOT_MODE.RANDOM) -> None:
        self.mode = mode

    def prompt(self, prompt: str) -> str:
        """Generate a reply from the chatbot using the given prompt"""
        if self.mode == CHATBOT_MODE.RANDOM:
            return self.__random_reply()
        else:
            return "ERROR: Chatbot mode not implemented yet"

    def __random_reply(self) -> str:
        """Return a random reply from the chatbot"""
        sleep(random.uniform(0.25, 3.5))
        lines = open(self.random_answers_path, "r").readlines()
        return random.choice(lines)
