import os
from flask import Flask, render_template, abort, request, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Channels stored in memory
channels = {}

@app.route("/")
def index():
    return render_template("index.html", channels=channels)

@app.route("/channels/<string:name>")
def channel(name):

    # Checks for not existing channels
    if name not in channels:
        return abort(404)

    channel = channels[name]

    return render_template("channel.html", channel=channel)


@app.route("/channels", methods=["POST"])
def add_channel():

    if request.method == "POST":
        try:
            channel = request.form.get("channel_name")
        except ValueError:
            print(ValueError)

        # Adding new channel to list
        channels[channel] = {"name": channel, "messages": []}

        return redirect(url_for("index"))


@socketio.on("add message")
def add_message(data):

    # Adding message to channel
    channel = data["channel"]
    message = data["message"]
    channels[channel]["messages"].append(message)

    # Broadcasting message created to all connected to socket
    emit("message created", {"message": message}, broadcast=True)



if __name__ == "__main__":
    app.run()