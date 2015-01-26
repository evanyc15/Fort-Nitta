import os
basedir = os.path.abspath(os.path.dirname(__file__))
   
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

CORS_HEADERS = 'Content-Type'

AVATAR_UPLOADS = os.path.join(basedir, 'avatar_uploads/')

MAX_CONTENT_LENGTH = 256 * 1024