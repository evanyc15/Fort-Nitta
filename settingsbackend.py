import os
basedir = os.path.abspath(os.path.dirname(__file__))
   
SQLALCHEMY_DATABASE_URI = "postgresql://nitta_wars:nitta_wars@localhost/nitta_wars"

CORS_HEADERS = ['Content-Type', 'X-CSRF-Token', 'Authentication', 'Accept']
CORS_SUPPORTS_CREDENTIALS = ['True']
CORS_RESOURCES = {r"/api/*": {"origins": "http://localhost"}}

AVATAR_UPLOADS = os.path.join(basedir, 'backend/assets/avatar')

MAX_CONTENT_LENGTH = 16 * 1024 * 1024