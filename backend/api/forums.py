from flask import request, jsonify, Response, session, redirect, make_response
from flask.views import MethodView
from sqlalchemy import and_, or_

from backend import db, app
from backend.database.models import User, ForumsThreads, ForumsPosts


class ThreadsAPI(MethodView):
    def POST(self):
        request_data = request.get_json(force=True, silent=True)
        if ('category_id' in request_data) and ('user_id' in request_data) and ('title' in request_data):
            new_thread = ForumsThreads(
                    category_id =   request_data['category_id'],
                    user_id =       request_data['user_id'],
                    title =         request_data['title'] 
                )
            db.session.add(new_thread)
            db.session.commit()

            return jsonify(**{'success': True, 'id': new_thread.id})
        return jsonify(**{'success': False}), 401

    def GET(self):

        return jsonify(**{'success': False}), 401

class PostsAPI(MethodView):
    def POST(self):
        request_data = request.get_json(force=True, silent=True)
        if ('thread_id' in request_data) and ('user_id' in request_data) and ('message' in request_data):
            new_post = ForumsPosts(
                    thread_id = request_data['thread_id']
                    user_id =   request_data['user_id']
                    message =   request_data['message']
                )
            db.session.add(new_post)
            db.session.commit()

            return jsonify(**{'success': True, 'id': new_post.id})
        return jsonify(**{'success': False}), 401

    def GET(self):

        return jsonify(**{'success': False}), 401

class PostsImagesAPI(MethodView):
    def POST(self):

        return jsonify(**{'success': False}), 401

threads_view = ThreadsAPI.as_view('threads_api')
app.add_url_rule('/api/forums/threads', view_func=threads_view, methods=['POST','GET'])

posts_view = PostsAPI.as_view('posts_api')
app.add_url_rule('/api/forums/posts', view_func=posts_view, methods=['POST','GET'])

postsimage_view = PostsImagesAPI.as_view('postsimages_api')
app.add_url_rule('/api/forums/postsimages', view_func=postsimage_view, methods=['POST'])