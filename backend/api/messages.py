## @package messages.py
# Package used to run the instant messaging on the server

from flask import request, jsonify, Response, session, redirect, make_response
from flask.views import MethodView
from sqlalchemy import and_, or_

from backend import db, app
from backend.database.models import User, ChatMessages

import gevent, json

## Handles the stream of new messages
def event_stream():
    message_id = 0
    from_username = request.args.get('from_username')
    to_username = request.args.get('to_username')

    while True:
        # Check database every n seconds (2 right now)
        gevent.sleep(1)

        messageList = []
        to_user = User.query.filter_by(username = to_username).first()
        from_user = User.query.filter_by(username = from_username).first()
        if to_user is None or from_user is None:
            return jsonify(**{'success': False})
        messages = ChatMessages.query.filter(and_(or_(ChatMessages.to_user == to_user.id, ChatMessages.to_user == from_user.id), or_(ChatMessages.from_user == to_user.id, ChatMessages.from_user == from_user.id), ChatMessages.id > message_id)).order_by(ChatMessages.id.asc()).all()
        if not messages or messages is None:
            return jsonify(**{'success': False})
        for messageHolder in messages:
            if messageHolder.id > message_id:
                message_id = messageHolder.id
            to_user = User.query.filter_by(id = messageHolder.to_user).first()
            from_user = User.query.filter_by(id = messageHolder.from_user).first()
            jsonData = {'id':messageHolder.id,'from_username':from_user.username,'from_firstname':from_user.first_name,'from_lastname':from_user.last_name,'from_avatar_path':from_user.avatar_path,'to_username':to_user.username,'to_firstname':to_user.first_name,'to_lastname':to_user.last_name,'to_avatar_path':to_user.avatar_path,'message':messageHolder.message,'message_created':messageHolder.date_created.strftime("%Y-%m-%d %H:%M:%S")}
            messageList.append(jsonData)
        return "data: %s\n\n" % json.dumps(messageList)    

# This does the same as ChatMessageApi's GET method but is used for SSE pushing for dynamic chatting
@app.route('/messageStream')
def messageStream():
    return Response(event_stream(), mimetype="text/event-stream")

# For POST, it is used to verify if a user exists in the database
# For GET, it is used to get all usernames from the database
## Used to access user records from the database
class ChatUserRetrieveApi(MethodView):
    ## Returns all users from the database
    def get(self):
        usersList = []
        users = User.query.with_entities(User.username).all()
        if users is None:
            return jsonify(**{'success': False})
        for holder in users:
            jsonData = {'username': holder.username}
            usersList.append(jsonData)
        return json.dumps(usersList)
    ## Verifies that the username passed in exists
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data['username'] is not None:
            user = User.query.filter_by(username = request_data['username']).first()
            if user is None:
                return jsonify(**{'success': False}), 401
            if not user.avatar_path:
                return jsonify(**{'success': True, 'username':user.username,'firstname':user.first_name,'lastname':user.last_name,'avatar_path': ""})
            return jsonify(**{'success': True, 'username':user.username,'firstname':user.first_name,'lastname':user.last_name,'avatar_path': user.avatar_path})
        return jsonify(**{'success':False}), 401

# For POST, this submits a new message to the database
# For GET, this returns a conversation aka all messages between two users
## Retrieves existing and adds new messages
class ChatMessageApi(MethodView):
    ## Submits a new message to the database
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data['to_user'] is not None and request_data['from_user'] is not None:
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

    ## Returns all messages between two users
    def get(self):
        messageList = []

        # This is to get the messages for a chat. It gets the messages between a from_user and to_user
        if request.args.get('from_username') and request.args.get('to_username') and request.args.get('message_id'):
            to_username = request.args.get('to_username')
            from_username = request.args.get('from_username')
            to_user = User.query.filter_by(username = to_username).first()
            from_user = User.query.filter_by(username = from_username).first()
            messages = ChatMessages.query.filter(and_(or_(ChatMessages.to_user == to_user.id, ChatMessages.to_user == from_user.id), or_(ChatMessages.from_user == to_user.id, ChatMessages.from_user == from_user.id), ChatMessages.id > request.args.get('message_id'))).all()
            if not messages or messages is None:
                return jsonify(**{'success': False}), 401
            for messageHolder in messages:
                to_user = User.query.filter_by(id = messageHolder.to_user).first()
                from_user = User.query.filter_by(id = messageHolder.from_user).first()
                jsonData = {'id':messageHolder.id,'from_username':from_user.username,'from_firstname':from_user.first_name,'from_lastname':from_user.last_name,'from_avatar_path':from_user.avatar_path,'to_username':to_user.username,'to_firstname':to_user.first_name,'to_lastname':to_user.last_name,'to_avatar_path':to_user.avatar_path,'message':messageHolder.message,'message_created':messageHolder.date_created.strftime("%Y-%m-%d %H:%M:%S")}
                messageList.append(jsonData)
            return json.dumps(messageList)

        # This is to get just all the messages for a specific user regardless of to_user or from_user
        # This is mostly used to get the messages for the notification message dropdown in the website
        elif request.args.get('username'):
            user = User.query.filter_by(username = request.args.get('username')).first()
            messages = ChatMessages.query.filter(and_(ChatMessages.to_user==user.id,ChatMessages.read==False)).order_by(ChatMessages.id.asc()).limit(25).all()
            for messageHolder in messages:
                user = User.query.filter_by(id=messageHolder.from_user).first()
                jsonData = {'id':messageHolder.id,'username':user.username,'firstname':user.first_name,'lastname':user.last_name,'avatar_path':user.avatar_path,'message':messageHolder.message,'message_created':messageHolder.date_created.strftime("%Y-%m-%d %H:%M:%S")}
                messageList.append(jsonData)
            return json.dumps(messageList)
        return jsonify(**{'success': False}), 401

    ## Updates the 'read' attribute for the messages of a user
    def put(self):
        # Gets to_username from REST parameters and gets from_username from REST parameters
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': False}), 401
        to_user = User.query.filter_by(username=request_data['to_username']).first()
        from_user = User.query.filter_by(username=request_data['from_username']).first()
        if not to_user or not from_user:
            return jsonify(**{'success': False}), 401
        messages = ChatMessages.query.filter(or_(and_(ChatMessages.to_user==to_user.id,ChatMessages.from_user==from_user.id),and_(ChatMessages.to_user==from_user.id,ChatMessages.from_user==to_user.id))).all()
        if not messages:
            return jsonify(**{'success': False}), 401
        for data in messages:
            data.read = True
            db.session.add(data)
            db.session.commit()
        return jsonify(**{'success': True})

## Get all the users that a "this" user has chatted with
class ChatUserApi(MethodView):
    def get(self):
        userList = []

        if request.args.get('user'):
            user = request.args.get('user')
            users = ChatMessages.query.filter(or_(ChatMessages.to_user == user, ChatMessages.from_user == user)).all()
            for userHolder in users:
                to_user = User.query.filter_by(id = userHolder.to_user).first()
                from_user = User.query.filter_by(id = userHolder.from_user).first()
                if to_user is None or from_user is None:
                    return jsonify(**{'success': False}), 401
                jsonData = {'to_username':to_user.username,'to_firstname':to_user.first_name,'to_lastname':to_user.last_name,'to_avatar_path':to_user.avatar_path,'from_username':from_user.username,'from_firstname':from_user.first_name,'from_lastname':from_user.last_name,'from_avatar_path':from_user.avatar_path}
                userList.append(jsonData)
            return json.dumps(userList)
        return jsonify(**{'success': False}), 401

chat_user_view = ChatUserApi.as_view('chat_user_api')
app.add_url_rule('/api/messages/users/', view_func=chat_user_view, methods=['GET'])

chat_message_view = ChatMessageApi.as_view('chat_message_api')
app.add_url_rule('/api/messages/chat/', view_func=chat_message_view, methods=['POST','GET','PUT'])

chat_userRetrieve_view = ChatUserRetrieveApi.as_view('chat_userretrieve_api')
app.add_url_rule('/api/messages/retrieveUsers/', view_func=chat_userRetrieve_view, methods=['GET','POST'])