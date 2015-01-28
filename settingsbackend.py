import os
basedir = os.path.abspath(os.path.dirname(__file__))
   
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

CORS_HEADERS = ['Content-Type', 'X-CSRF-Token', 'Authentication', 'Accept']
CORS_SUPPORTS_CREDENTIALS = ['True']
CORS_RESOURCES = {r"/api/*": {"origins": "http://localhost"}}

PUBLIC_ROOT = os.path.join(basedir, 'public/')
AVATAR_UPLOADS = os.path.join(basedir, 'backend/img/avatar/')

MAX_CONTENT_LENGTH = 16 * 1024 * 1024