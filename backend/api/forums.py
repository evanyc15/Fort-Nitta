from flask import request, jsonify, Response, session, redirect, make_response
from flask.views import MethodView
from sqlalchemy import and_, or_

from backend import db, app
from backend.database.models import User, ForumsThreads, ForumsPosts
import json


class ThreadsAPI(MethodView):
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': 'none'}), 401

        if ('category_id' in request_data) and ('user_id' in request_data) and ('title' in request_data):
            new_thread = ForumsThreads(
                    category_id =   request_data['category_id'],
                    user_id =       request_data['user_id'],
                    title =         request_data['title'] 
                )
            db.session.add(new_thread)
            db.session.commit()

            return jsonify(**{'success': True, 'id': new_thread.id})
        return jsonify(**{'success': False,}), 401

    def get(self):
        threadArray = []

        category_id = request.args.get('id')
        if category_id is "" or category_id is None:
            return jsonify(**{'success': 'none'}), 401
        threads = ForumsThreads.query.join(ForumsThreads.user).filter(ForumsThreads.category_id==category_id).all()
        if threads is not None:
            for data in threads:
                jsonData = {'id':data.id,'category_id':data.category_id,'user_id':data.user_id,'username':data.user.username,'first_name':data.user.first_name,'last_name':data.user.last_name,'title':data.title,'replies':data.replies,'views':data.views,'date_created':data.date_created.strftime("%Y-%m-%d %H:%M:%S")}
                threadArray.append(jsonData)
            return json.dumps(threadArray)
        return jsonify(**{'success': False}), 401

class PostsAPI(MethodView):
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': 'none'}), 401

        if ('thread_id' in request_data) and ('user_id' in request_data) and ('message' in request_data):
            new_post = ForumsPosts(
                    thread_id = request_data['thread_id'],
                    user_id =   request_data['user_id'],
                    message =   request_data['message']
                )
            db.session.add(new_post)
            db.session.commit()

            return jsonify(**{'success': True, 'id': new_post.id})
        return jsonify(**{'success': False}), 401

    def get(self):
        postsArray = []

        thread_id = request.args.get('id')
        if thread_id is "" or thread_id is None:
            return jsonify(**{'success': 'none'}), 401
        posts = ForumsPosts.query.join(ForumsPosts.user).filter(ForumsPosts.thread_id==thread_id).all()
        if posts is not None:
            for data in posts:
                jsonData = {'id':data.id,'thread_id':data.thread_id,'user_id':data.user_id,'username':data.user.username,'first_name':data.user.first_name,'last_name':data.user.last_name,'message':data.message,'date_created':data.date_created.strftime("%Y-%m-%d %H:%M:%S")}
                postsArray.append(jsonData)
            return json.dumps(postsArray)
        return jsonify(**{'success': False}), 401

class PostsImagesAPI(MethodView):
    def post(self):

        return jsonify(**{'success': False}), 401

threads_view = ThreadsAPI.as_view('threads_api')
app.add_url_rule('/api/forums/threads', view_func=threads_view, methods=['POST','GET'])

posts_view = PostsAPI.as_view('posts_api')
app.add_url_rule('/api/forums/posts', view_func=posts_view, methods=['POST','GET'])

postsimage_view = PostsImagesAPI.as_view('postsimages_api')
app.add_url_rule('/api/forums/postsimages', view_func=postsimage_view, methods=['POST'])