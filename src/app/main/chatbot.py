import random
from time import sleep
import os.path
from typing import Literal
import re


class ChatbotMediator:
    """Mediator class to handle I/O and prompt with the chatbot"""

    def __init__(self) -> None:
        pass

    @staticmethod
    def prompt_chatbot(prompts: list[str], bot: "ChatbotAgent") -> list[str]:
        """Prompt the chatbot with the given prompt"""
        prompt_structured = ChatbotMediator.__generate_prompt(prompts, bot)
        reply = bot.prompt(prompt_structured)

        return ChatbotMediator.__structure_reply(reply)

    @staticmethod
    def __generate_prompt(messages: list[str], bot: "ChatbotAgent") -> str:
        """Generate a structured prompt for the chatbot"""
        # get personality info and memory etc from bot and add to prompt
        # ... for now, do nothing
        return str(messages)

    @staticmethod
    def __structure_reply(reply: str) -> list[str]:
        """Structure the reply from the chatbot, e.g. split by period"""
        # Matches whitespace preceded by any number and combo of ., !, ?
        pattern = r"(?<=[.!?])\s"
        return [i for i in re.split(pattern, reply) if i != ""]


class ChatbotAgent:
    """
    Agent process that converse with a single user, spawned per session
    """

    random_answers_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "random_answers.txt"
    )

    def __init__(self, mode: Literal["random", "chatgpt", "echo"] = "random") -> None:
        self.mode = mode
        self.id = random.randint(0, 100000)

    def prompt(self, prompt: str) -> str:
        """Generate a reply from the chatbot using the given prompt"""
        if self.mode == "random":
            return self.__random_reply()
        elif self.mode == "echo":
            return prompt
        else:
            return "ERROR: Chatbot mode not implemented yet"

    def __random_reply(self) -> str:
        """Return a random reply from the chatbot, for debugging purposes"""
        sleep(random.uniform(0.25, 3.5))
        n_replies = random.randint(1, 3)
        lines = open(self.random_answers_path, "r").readlines()
        reply = f"(ID: {self.id})"
        i = 0

        for _ in range(n_replies):
            string = random.choice(lines).strip()
            if string == "":
                continue
            reply += f"{i} {string} "
            i += 1
        # Include bot ID for debugging
        return reply
