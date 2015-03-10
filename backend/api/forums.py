## @package forums.py
# Package used to manage the forum

from flask import request, jsonify, Response, session, redirect, make_response
from flask.views import MethodView
from sqlalchemy import and_, or_

from backend import db, app
from backend.database.models import User, ForumsThreads, ForumsPosts, ForumsPostsLikes, ForumsPostsImages
from sessionauth import session_auth_required, current_user_props
from PIL import Image
import json
import hashlib
import os

## ThreadAPI class
# Used to add and delete threads
class ThreadsAPI(MethodView):
    ## post method
    # Used to create a new thread,
    # Expects:
    # @param category_id 
    # @param user_id
    # @param title
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

    ## get method
    # Used to get all threads of a category
    # Expects (in JSON data)
    # @param id The id of the category
    def get(self):
        threadArray = []

        category_id = request.args.get('id')
        if category_id is "" or category_id is None:
            return jsonify(**{'success': 'none'}), 401
        threads = ForumsThreads.query.join(ForumsThreads.user).filter(ForumsThreads.category_id==category_id).order_by(ForumsThreads.date_created.desc()).all()
        if threads is not None:
            for data in threads:
                jsonData = {'id':data.id,'category_id':data.category_id,'user_id':data.user_id,'username':data.user.username,'first_name':data.user.first_name,'last_name':data.user.last_name,'title':data.title,'replies':data.replies,'views':data.views,'date_created':data.date_created.strftime("%Y-%m-%d %H:%M:%S")}
                threadArray.append(jsonData)
            return json.dumps(threadArray)
        return jsonify(**{'success': False}), 401

## PostsAPI class
# used to manage posts within a thread
class PostsAPI(MethodView):
    ## post method
    # Used to create a new post within a thread
    # Expects (in JSON data)
    # @param thread_id The ID of the thread
    # @param user_id The ID of the poster
    # @param message The content of the post
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

    ## get method
    # Used to retrieve the posts in JSON format. The resulting JSON array will also indicate whether a user has already liked a post.
    # Expects in JSON data
    # @param thread_id The ID of the thread
    # @param user_id The ID of the user
    def get(self):
        postsArray = []

        thread_id = request.args.get('thread_id')
        user_id = request.args.get('user_id')
        if thread_id is "" or thread_id is None or user_id is "" or user_id is None:
            return jsonify(**{'success': 'none'}), 401
        # get all posts
        posts = ForumsPosts.query.join(ForumsPosts.user).filter(ForumsPosts.thread_id==thread_id).order_by(ForumsPosts.date_created.desc()).all()
        if posts is not None:
            for data in posts:
                userinLikes = True
                likesCount = ForumsPostsLikes.query.filter(ForumsPostsLikes.post_id==data.id).count()
                userinLikesCheck = ForumsPostsLikes.query.filter(and_(ForumsPostsLikes.post_id==data.id,ForumsPostsLikes.user_id==user_id)).first()
                if userinLikesCheck is None:
                    userinLikes = False

                forumImagesArray = []
                forum_images = ForumsPostsImages.query.filter(ForumsPostsImages.post_id==data.id).all()
                for dataImg in forum_images:
                    jsonImages = {'id': dataImg.id, 'post_id': dataImg.post_id, 'image_path': dataImg.image_path}
                    forumImagesArray.append(jsonImages)
                jsonData = {'id':data.id,'thread_id':data.thread_id,'user_id':data.user_id,'username':data.user.username,'first_name':data.user.first_name,'last_name':data.user.last_name,'message':data.message,'date_created':data.date_created.strftime("%Y-%m-%d %H:%M:%S"),'user_inLikes':userinLikes,'likes_Count':likesCount, 'forum_images': forumImagesArray}
                postsArray.append(jsonData)
            return json.dumps(postsArray)
        return jsonify(**{'success': False}), 401
## PostsImagesAPI class
# Class used to upload images for the forum posts.
class PostsImagesAPI(MethodView):
    ## get method
    # Used to upload a new image file
    def post(self):
        file = request.files['images']
        post_id = request.headers.get('postid')
        filepath = None

        if not file or not post_id:
            return jsonify(**{'success': False}), 401

        ext = (file.filename.rsplit('.', 1)[1]) if ('.' in file.filename) else None

        if ext not in ['jpg', 'jpeg', 'png', 'gif']:
            return jsonify(**{'success': False}), 422

        filenameHash = hashlib.md5(file.filename).hexdigest()
        
        # Creating file path
        if not os.path.isdir(app.config['FORUMS_IMG_UPLOADS']):
            os.makedirs(app.config['FORUMS_IMG_UPLOADS'])
        filepath = app.config['FORUMS_IMG_UPLOADS']
        if not os.path.isdir(filepath+'/'+filenameHash[3:5]):
            os.makedirs(filepath+'/'+filenameHash[3:5])
        filepath = filepath+'/'+filenameHash[3:5]
        if not os.path.isdir(filepath+'/'+filenameHash[0:2]):
            os.makedirs(filepath+'/'+filenameHash[0:2])
        filepath = filepath+'/'+filenameHash[0:2]
        if not os.path.isdir(filepath+'/'+filenameHash[5:7]):
            os.makedirs(filepath+'/'+filenameHash[5:7])
        filepath = filepath+'/'+filenameHash[5:7]

        # PIL Image Compression
        image = Image.open(file)
        # Calculate the height using the same aspect ratio
        widthPercent = (800 / float(image.size[0]))
        height = int((float(image.size[1]) * float(widthPercent)))
        image = image.resize((800, height), Image.ANTIALIAS)

        image.save(os.path.join(filepath, file.filename), optimize=True, quality=65)
        # fileOut.save(os.path.join(filepath, file.filename))

        new_forum_img = ForumsPostsImages(
                post_id = post_id,
                image_path = filenameHash[3:5]+'/'+filenameHash[0:2]+'/'+filenameHash[5:7]+'/'+file.filename    
            )
        db.session.add(new_forum_img)
        db.session.commit()
        
        return jsonify(**{'success': True ,'id': new_forum_img.id})

        # return jsonify(**{'success': False, 'Default': True, 'Type': 'post'}), 401
    ## get method
    # Used to retrieve all image file ids, the ids of the posts they belong to, and the image_path
    def get(self):

        forumImagesArray = []

        post_id = request.args.get('post_id')

        forum_images = ForumsPostsImages.query.filter(ForumsPostsImages.post_id==post_id).all()
        for dataImg in forum_images:
            jsonImages = {'id': dataImg.id, 'post_id': dataImg.post_id, 'image_path': dataImg.image_path}
            forumImagesArray.append(jsonImages)
        return json.dumps(forumImagesArray)

## PostsLikesAPI
# Used to manage likes of a post
class PostsLikesAPI(MethodView):
    ## post method
    # Used to set the whether a specific used liked a post
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': 'none'}), 401

        if ('post_id' in request_data) and ('user_id' in request_data):
            new_like = ForumsPostsLikes(
                post_id = request_data['post_id'],
                user_id = request_data['user_id']    
            )
            db.session.add(new_like)
            db.session.commit()

            return jsonify(**{'success': True, 'id': new_like.id})
        return jsonify(**{'success': False}), 401

    ## delete method
    # Used to unlike a post (from perspective of specific user)
    def delete(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': 'none'}), 401

        if ('post_id' in request_data) and ('user_id' in request_data):
            post_like = ForumsPostsLikes.query.filter(and_(ForumsPostsLikes.post_id==request_data['post_id'],ForumsPostsLikes.user_id==request_data['user_id'])).first()
            db.session.delete(post_like)
            db.session.commit()

            return jsonify(**{'success': True})
        return jsonify(**{'success': False}), 401

# Routing information
threads_view = ThreadsAPI.as_view('threads_api')
app.add_url_rule('/api/forums/threads/', view_func=threads_view, methods=['POST','GET'])

posts_view = PostsAPI.as_view('posts_api')
app.add_url_rule('/api/forums/posts/', view_func=posts_view, methods=['POST','GET'])

postsimage_view = PostsImagesAPI.as_view('postsimages_api')
app.add_url_rule('/api/forums/postsimages/', view_func=postsimage_view, methods=['POST','GET'])

postslikes_view = PostsLikesAPI.as_view('postslike_api')
app.add_url_rule('/api/forums/likes/', view_func=postslikes_view, methods=['POST','DELETE'])