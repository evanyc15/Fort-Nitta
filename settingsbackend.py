import os
basedir = os.path.abspath(os.path.dirname(__file__))

# Shhhh!
from secrets import *



# Flask
DEBUG = True



# Database location, credentials
DB_USERNAME = "nitta_wars"
# DB_PASSWORD defined in secrets
DB_HOST = "localhost"
DB_NAME = "nitta_wars"
SQLALCHEMY_DATABASE_URI = "postgresql://{0}:{1}@{2}/{3}".format(DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME)



# Flask email settings
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 465
MAIL_USE_TLS = False
MAIL_USE_SSL = True
MAIL_DEBUG = False
MAIL_SUPPRESS_SEND = False
MAIL_USERNAME = 'ecs160server.winter2015@gmail.com'
# MAIL_PASSWORD defined in secrets



# CORS
CORS_HEADERS = ['Content-Type','X-CSRF-Token','Authentication','Accept','X-Requested-With','Content-Length','Content-Disposition']
CORS_SUPPORTS_CREDENTIALS = ['True']
CORS_RESOURCES = {r"/api/*": {"origins": "http://localhost"}}



# Avatar upload path
AVATAR_UPLOADS = os.path.join(basedir, 'backend/assets/avatar')

# Forums upload path
FORUMS_IMG_UPLOADS = os.path.join(basedir, 'backend/assets/forums/img')

# Game downloads
GAME_DOWNLOADS = os.path.join(basedir, 'backend/assets/downloads')

# Content upload maximum
MAX_CONTENT_LENGTH = 16 * 1024 * 1024
