from flask import request, jsonify
from flask.views import MethodView
from flask.ext.login import current_user, login_user, logout_user

from backend import db, app, bcrypt
from backend.database.models import User, Presence, UserPrivileges
import datetime



def session_auth_required(func):
    def decorated(*args, **kwargs):
        if not current_user.is_authenticated():
            return jsonify(**{'authenticated': False}), 401
        return func(*args, **kwargs)

    return decorated

def current_user_props():
    userprivileges = UserPrivileges.query.filter(UserPrivileges.user_id==current_user.id).first()
    return {'username': current_user.username, 
        'uid': current_user.id, 
        'first_name': current_user.first_name, 
        'last_name': current_user.last_name,
        'email': current_user.email,
        'date_joined': current_user.date_joined,
        'avatar_path': current_user.avatar_path,
        'new_user': current_user.new_user,
        'admin': userprivileges.admin_access
    } if current_user.is_authenticated() else {}

def hash_password(pw):
    return bcrypt.generate_password_hash(pw)

def check_password(pw, hashed):
    return bcrypt.check_password_hash(hashed, pw)



class SessionAuthAPI(MethodView):
    def post(self):
        errors = None
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': False}), 401

        if ('username' in request_data) and ('password' in request_data):
            user = User.query.filter_by(username=request_data['username']).first()
            #if user and check_password(request_data['password'], user.password):
            if user and user.password == request_data['password']:
                login_user(user)
                presence = Presence.query.filter(Presence.user_id==user.id).first()
                if presence is None:
                    return jsonify(**{'success': False}), 401
                presence.web_online = True        
                db.session.add(presence)
                db.session.commit()
                # Leave property authenticated to be calculated by current_user.is_authenticated()     
                return jsonify(**{'success': True, 'authenticated': current_user.is_authenticated(), 'user': current_user_props()})
            else:
                errors = 'Invalid username or password'

        return jsonify(**{'success': False, 'authenticated': current_user.is_authenticated(), 'errors': errors}), 401

    @session_auth_required
    def get(self):
        return jsonify(**{'authenticated': True, 'user': current_user_props()})

    def delete(self):
        presence = Presence.query.filter(Presence.user_id==current_user.id).first()
        if presence is None:
            return jsonify(**{'success': False}), 401
        presence.web_online = False 
        presence.web_last_seen = datetime.datetime.now()       
        db.session.add(presence)
        db.session.commit()
        logout_user()
        return jsonify(**{'success': True, 'authenticated': current_user.is_authenticated()})

session_auth_view = SessionAuthAPI.as_view('session_auth_api')
app.add_url_rule('/api/session_auth/', view_func=session_auth_view, methods=['GET', 'POST', 'DELETE'])
