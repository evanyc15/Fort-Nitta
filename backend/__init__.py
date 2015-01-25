from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager

from secrets import SECRET_KEY



app = Flask(__name__)
app.config.from_object('settingsbackend')
app.secret_key = SECRET_KEY

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

from backend.database import *
from backend.api import *

try:
    db.create_all()
except Exception:
    # Already exists
    print("Tried to create database")
    pass
