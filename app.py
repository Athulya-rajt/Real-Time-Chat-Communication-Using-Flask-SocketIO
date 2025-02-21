from flask import Flask, render_template
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def landing():
    return render_template("landing.html")

@app.route("/chat")
def chat():
    return render_template("index.html")

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on("message")
def handle_message(msg):
    print('Received message:', msg)
    send(msg, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True)
