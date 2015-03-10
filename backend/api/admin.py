## @package admin
#   Package used to control admin functions, such as Global announcements, and user privileges

from flask import request, jsonify, Response, session, redirect, make_response
from flask.views import MethodView
from sqlalchemy import and_, or_

from backend import db, app
from backend.database.models import User, GlobalAnnouncements, GlobalAnnouncementsPosts, UserPrivileges, Todo
from sessionauth import session_auth_required, current_user_props
import json
import os

## GlobalAnnouncementsAPI
# Used to create and request global announcements.
class GlobalAnnouncementsAPI(MethodView):
    ## post function
    #  Used to create a new global announcement
    #  Expects JSON object with
    # @param subject The subject of the announcement
    # @param posted_by The user who posted the announcement

    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': 'none'}), 401
        if ('subject' in request_data) and ('posted_by' in request_data):
            announcement  = GlobalAnnouncements(
                    subject =       request_data['subject'],
                    posted_by =     request_data['posted_by']
                )
            db.session.add(announcement)
            db.session.commit()
            return jsonify(**{'success': True, 'id': announcement.id})
        return jsonify(**{'success': False,}), 401
    ## get function
    # Used to retrieve all global announcements from the database
    def get(self):
        announcementsArray = []

        announcements = GlobalAnnouncements.query.all()
        if announcements is None:
            return jsonify(**{'success': 'none'}), 401
        for data in announcements:
            jsonData = {'id':data.id, 'subject': data.subject,'posted_by': data.posted_by,'date_created':data.date_created.strftime("%Y-%m-%d %H:%M:%S")}
            announcementsArray.append(jsonData)
        return json.dumps(announcementsArray)

## GlobalAnnouncementsPostsAPI class
# Used to change and retrieve specific announcements
class GlobalAnnouncementsPostsAPI(MethodView):
    ## post function
    # Used to update an existing announcement
    # Expects a json construct with:
    # @param message The message to use
    # @param announcement_id The id of the announcement to overwrite
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': 'none'}), 401
        if ('message' in request_data) and ('announcement_id' in request_data):
            announcementpost = GlobalAnnouncementsPosts(
                    message = request_data['message'],
                    gbAnn_id = request_data['announcement_id']
                )
            db.session.add(announcementpost)
            db.session.commit()
            return jsonify(**{'success': True, 'id': announcementpost.id})
        return jsonify(**{'success': False,}), 401

    def get(self):
        announcementpostArray = []

        announcement_id = request.args.get('id')
        if announcement_id is "" or announcement_id is None:
            return jsonify(**{'success': 'none'}), 401
        announcementposts = GlobalAnnouncementsPosts.query.filter(GlobalAnnouncementsPosts.gbAnn_id==announcement_id).all()
        if announcementposts is not None:
            for data in announcementposts:
                jsonData = {'id':data.id, 'message': data.message}
                announcementpostArray.append(jsonData)
            return json.dumps(announcementpostArray)
        return jsonify(**{'success': 'none'}), 401

## ToDoAPI class
# Used to update the todo list
class ToDoAPI(MethodView):
    ## post function
    # Used to create a new todo list item
    # Expects
    # @param message The message content
    # @param type The type of the task
    # @param status The current completion state of the task
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': 'none'}), 401
        if ('message' in request_data) and ('type' in request_data) and ('status' in request_data):
            todo = Todo(
                todo_message = request_data['message'],
                todo_type = request_data['type'],
                todo_status = request_data['status']
                )
            db.session.add(todo)
            db.session.commit()
            return jsonify(**{'success': True, 'id': todo.id})
        return jsonify(**{'success': False,}), 401

    ## get function
    # Used to retrieve all tasks
    def get(self):
        todo = Todo.query.all()
        return jsonify(list = todo)

## GlobalAnnouncementsGETAPI class
# Used to retrieve all ids and messages of the global announcements
class GlobalAnnouncementsGETAPI(MethodView):
    def get(self):
        announcementsArray = []
        announcements = GlobalAnnouncements.query.all()
        if announcements is None:
            return jsonify(**{'success': 'none'})
        for data in announcements:
            announcementPostArray = []
            announcementposts = GlobalAnnouncementsPosts.query.filter(GlobalAnnouncementsPosts.gbAnn_id==data.id).all()
            for data2 in announcementposts:
                jsonData2 = {'id':data2.id, 'message': data2.message}
                announcementPostArray.append(jsonData2)
            jsonData = {'id':data.id, 'subject': data.subject,'posted_by': data.posted_by,'date_created':data.date_created.strftime("%Y-%m-%d %H:%M:%S"), 'posts':announcementPostArray}
            announcementsArray.append(jsonData)
            return json.dumps(announcementsArray)
        return jsonify(**{'success': 'none'}), 401

## ClassPrivilegesAPI class
# Used to get, change and delete user privileges
class UserPrivilegesAPI(MethodView):
    ## get method
    # Retrieves all user privileges
    def get(self):
        userprivilegesArray = []
        userprivileges = UserPrivileges.query.join(UserPrivileges.user).all()
        if userprivileges is None:
            return jsonify(**{'success': 'none'})
        for data in userprivileges:
            jsonData = {'id': data.id,'admin_access':data.admin_access,'username':data.user.username,'first_name':data.user.first_name,'last_name':data.user.last_name,'email':data.user.email,'data_joined':data.user.date_joined.strftime("%Y-%m-%d")}
            userprivilegesArray.append(jsonData);
        return json.dumps(userprivilegesArray)

    ## post method
    # Used to grant admin privileges
    # Expects in the JSON request data:
    # @param id The id of the user
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': 'none'}), 401
        if 'id' in request_data:
            userprivileges = UserPrivileges.query.filter(UserPrivileges.id==request_data['id']).first()
            userprivileges.admin_access = True
            db.session.add(userprivileges)
            db.session.commit()
            return jsonify(**{'success':True})
        return jsonify(**{'success': False}), 401

    ## delete method
    # Used to revoke admin privileges from user
    # Expects id field in request data
    def delete(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': 'none'}), 401
        if 'id' in request_data:
            userprivileges = UserPrivileges.query.filter(UserPrivileges.id==request_data['id']).first()
            userprivileges.admin_access = False
            db.session.add(userprivileges)
            db.session.commit()
            return jsonify(**{'success':True})
        return jsonify(**{'success': False}), 401

# Routing information and view bindings
globalannouncements_view = GlobalAnnouncementsAPI.as_view('globalannouncements_api')
app.add_url_rule('/api/admin/announcements/', view_func=globalannouncements_view, methods=['POST','GET'])

globalannouncementsposts_view = GlobalAnnouncementsPostsAPI.as_view('globalannouncementsposts_api')
app.add_url_rule('/api/admin/announcementposts/', view_func=globalannouncementsposts_view, methods=['POST','GET'])

todo_view = ToDoAPI.as_view('todo_api')
app.add_url_rule('/api/admin/todo/', view_func=todo_view, methods=['POST','GET'])

globalannouncementsget_view = GlobalAnnouncementsGETAPI.as_view('globalannouncementsget_api')
app.add_url_rule('/api/announcements/', view_func=globalannouncementsget_view, methods=['GET'])

userprivileges_view = UserPrivilegesAPI.as_view('userprivileges_api')
app.add_url_rule('/api/admin/userprivileges/', view_func=userprivileges_view, methods=['GET','POST','DELETE'])

