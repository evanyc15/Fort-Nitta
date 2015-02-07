from flask import request, jsonify, Response, session, redirect, make_response
from flask.views import MethodView
from sqlalchemy import and_, or_

from backend import db, app
from backend.database.models import User, ChatMessages

import gevent, json

class ChatMessageApi(MethodView):
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if('to_user' in request_data) and ('from_user' in request_data):
            to_user = User.query.filter_by(username = request_data['to_user']).first()
            if to_user is None:
                return jsonify(**{'success': False, 'Body':'No to_user'}), 401
            from_user = User.query.filter_by(username = request_data['from_user']).first()
            if from_user is None:
                return jsonify(**{'success': False , 'Body':'No from_user'}), 401
            new_message = ChatMessages(to_user = to_user.id,
                from_user = from_user.id,
                message = request_data['message'])
            db.session.add(new_message)
            db.session.commit()
            return jsonify(**{'success': True})
        return jsonify(**{'success': False}), 401

    def get(self):
        messageList = []

        if request.args.get('user'):
            user = request.args.get('user')
            messages = ChatMessages.query.filter(or_(ChatMessages.to_user == user, ChatMessages.from_user == user)).all()
            if not messages or messages is None:
                return jsonify(**{'success': False}), 401
            for messageHolder in messages:
                to_user = User.query.filter_by(id = messageHolder.to_user).first()
                from_user = User.query.filter_by(id = messageHolder.from_user).first()
                jsonData = {'to_username': to_user.username,'from_username': from_user.username,'to_firstName': to_user.first_name,'to_lastName': to_user.last_name,'from_firstName': from_user.first_name,'from_lastName': from_user.last_name,'message_time': messageHolder.date_created.strftime("%Y-%m-%d %H:%M:%S"),'message': messageHolder.message}
                messageList.append(jsonData)
            return json.dumps(messageList)
        return jsonify(**{'success': False}), 401

class ChatUserApi(MethodView):
    def get(self):
        userList = []

        if request.args.get('user'):
            user = request.args.get('user')
            users = ChatMessages.query.filter(or_(ChatMessages.to_user == user, ChatMessages.from_user == user)).all()
            for userHolder in users:
                if userHolder.to_user != user:
                    userInfo = User.query.filter_by(id = userHolder.to_user).first()
                    jsonData = {'username':userInfo.username,'first_name':userInfo.first_name,'last_name':userInfo.last_name}
                    userList.append(jsonData)
                elif userHolder.from_user != user:
                    userInfo = User.query.filter_by(id = userHolder.from_user).first()
                    jsonData = {'username':userInfo.username,'first_name':userInfo.first_name,'last_name':userInfo.last_name}
                    userList.append(jsonData)
            return json.dumps(userList)
        return jsonify(**{'success': False}), 401

chat_user_view = ChatUserApi.as_view('chat_user_api')
chat_message_view = ChatMessageApi.as_view('chat_message_api')
app.add_url_rule('/api/messages/chat/', view_func=chat_message_view, methods=['POST','GET'])
app.add_url_rule('/api/messages/users/', view_func=chat_user_view, methods=['GET'])