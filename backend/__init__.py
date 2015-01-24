from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('settingsbackend')
db = SQLAlchemy(app)

from backend.database import models

try:
    db.create_all()
except Exception:
    # Already exists
    print("Tried to create database")
    pass