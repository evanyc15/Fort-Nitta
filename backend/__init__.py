from flask import Flask, send_from_directory
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from flask.ext.cors import CORS
from flask_mail import Mail, Message
from flask.ext.bcrypt import Bcrypt

from secrets import SECRET_KEY



# Flask app
app = Flask(__name__)

# Load config and secrets
app.config.from_object('settingsbackend')



# Flask extensions
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
cors = CORS(app)
mail = Mail(app)
bcrypt = Bcrypt(app)



# Import app content
from backend.database import *
from backend.api import *
from staticfiles import *



# Create db
try:
    db.create_all()
except Exception:
    # Already exists
    print("Tried to create database")
    pass
