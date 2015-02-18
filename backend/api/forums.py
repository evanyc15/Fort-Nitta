from flask import request, jsonify, Response, session, redirect, make_response
from flask.views import MethodView
from sqlalchemy import and_, or_

from backend import db, app
from backend.database.models import User


class ThreadsAPI(MethodView):
    def POST(self):

    def GET(self):


class PostsAPI(MethodView):
    def POST(self):

    def GET(self):


threads_view = ThreadsAPI.as_view('threads_api')
app.add_url_rule('/api/forums/threads', view_func=threads_view, methods=['POST','GET'])

posts_view = PostsAPI.as_view('posts_api')
app.add_url_rule('/api/forums/posts' view_func=posts_view, methods=['POST','GET'])