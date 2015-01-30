import os
basedir = os.path.abspath(os.path.dirname(__file__))

# Shhhh!
from secrets import *



# Flask
DEBUG = True



# Database location
SQLALCHEMY_DATABASE_URI = "postgresql://nitta_wars:nitta_wars@localhost/nitta_wars"



# Flask email settings
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USE_SSL = False
MAIL_USERNAME = 'ecs160server.winter2015@gmail.com'




# CORS
CORS_HEADERS = ['Content-Type', 'X-CSRF-Token', 'Authentication', 'Accept']
CORS_SUPPORTS_CREDENTIALS = ['True']
CORS_RESOURCES = {r"/api/*": {"origins": "http://localhost"}}



# Avatar upload path
AVATAR_UPLOADS = os.path.join(basedir, 'backend/assets/avatar')



# Content upload maximum
MAX_CONTENT_LENGTH = 16 * 1024 * 1024
