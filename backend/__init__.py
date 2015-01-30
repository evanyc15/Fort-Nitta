from flask import Flask, send_from_directory
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from flask.ext.cors import CORS
from flask_mail import Mail, Message

from secrets import SECRET_KEY



app = Flask(__name__)
app.config.from_object('settingsbackend')
app.secret_key = SECRET_KEY

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)

cors = CORS(app)

app.config.update(dict(
    DEBUG = True,
    MAIL_SERVER = 'smtp.gmail.com',
    MAIL_PORT = 587,
    MAIL_USE_TLS = True,
    MAIL_USE_SSL = False,
    MAIL_USERNAME = 'ecs160server.winter2015@gmail.com',
    MAIL_PASSWORD = 'nitta_wars',
))

mail=Mail(app)

# cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


# @app.after_request
# def after_request(data):
#     response = make_response(data)
#     response.headers['Content-Type'] = 'application/json'
#     response.headers['Access-Control-Allow-Origin'] = 'http://localhost'
#     response.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With,Content-Type, Accept"
#     response.headers['Access-Control-Allow-Methods'] = "GET,PUT,POST,DELETE,OPTIONS"
#     return response

from backend.database import *
from backend.api import *

from staticfiles import *

try:
    db.create_all()
except Exception:
    # Already exists
    print("Tried to create database")
    pass
