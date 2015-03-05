from flask import request, jsonify, Response, session, redirect, make_response
from flask.views import MethodView
from sqlalchemy import and_, or_

from backend import db, app
from backend.database.models import User, GlobalAnnouncements, GlobalAnnouncementsPosts, UserPrivileges, Todo
from sessionauth import session_auth_required, current_user_props
import json
import os

class GlobalAnnouncementsAPI(MethodView):
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

    def get(self):
        announcementsArray = []

        announcements = GlobalAnnouncements.query.all()
        if announcements is None:
            return jsonify(**{'success': 'none'}), 401
        for data in announcements:
            jsonData = {'id':data.id, 'subject': data.subject,'posted_by': data.posted_by,'date_created':data.date_created.strftime("%Y-%m-%d %H:%M:%S")}
            announcementsArray.append(jsonData)
        return json.dumps(announcementsArray)

class GlobalAnnouncementsPostsAPI(MethodView):
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

class ToDoAPI(MethodView):
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

    def get(self):
        todo = Todo.query.all()
        return jsonify(list = todo)

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

globalannouncements = GlobalAnnouncementsAPI.as_view('globalannouncements_api')
app.add_url_rule('/api/admin/announcements/', view_func=globalannouncements, methods=['POST','GET'])

globalannouncementsposts = GlobalAnnouncementsPostsAPI.as_view('globalannouncementsposts_api')
app.add_url_rule('/api/admin/announcementposts/', view_func=globalannouncementsposts, methods=['POST','GET'])

todo = ToDoAPI.as_view('todo_api')
app.add_url_rule('/api/admin/todo/', view_func=todo, methods=['POST','GET'])

globalannouncementsget = GlobalAnnouncementsGETAPI.as_view('globalannouncementsget_api')
app.add_url_rule('/api/announcements/', view_func=globalannouncementsget, methods=['GET'])