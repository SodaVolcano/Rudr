""" Script to run in flask shell """
import os
import subprocess

from app import create_app, db


def run_command(command):
    """Initlaise the database and run the migrations"""
    process = subprocess.Popen(
        command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    stdout, stderr = process.communicate()

    if process.returncode != 0:
        # An error occurred
        print(f"Command failed with error code {process.returncode}:")
        print(stderr.decode())
    else:
        # The command was successful
        print(stdout.decode())


command = (
    "cd ./src/ && flask db init ; flask db migrate -m 'db init' ; flask db upgrade"
)
run_command(command)

app = create_app(os.getenv("FLASK_CONFIG") or "default")


@app.shell_context_processor
def make_shell_context():
    return dict(db=db)
