import os

from flask import Flask, render_template, abort, request, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Channels stored in memory
channels = []

@app.route("/")
def index():
    return render_template("index.html", channels=channels)

@app.route("/channels/<string:name>")
def channel(name):

    # Checks for not existing channels
    if name not in channels:
        return abort(404)

    return render_template("channel.html", channel=name)


@app.route("/channels", methods=["POST"])
def add_channel():

    if request.method == "POST":
        try:
            channel = request.form.get("channel_name")
        except ValueError:
            print(ValueError)

        # Criando o dicionário do canal
        channel_dict = dict()
        channel_dict[channel] = {"name": channel, "messages":[]}


        # adds to list of channels
        channels.append(channel_dict)

        return redirect(url_for("index"))

    # # broadcasts change to channel list
    # emit("channel created", {"channel_name": channel}, broadcast=True)
