from flask import request, jsonify
from flask.views import MethodView
from flask.ext.login import current_user, login_user, logout_user

from backend import db, app
from backend.database.models import User



def session_auth_required(func):
    def decorated(*args, **kwargs):
        if not current_user.is_authenticated():
            return jsonify(**{'authenticated': False}), 401
        return func(*args, **kwargs)

    return decorated

def current_user_props():
    return {'username': current_user.username, 
        'uid': current_user.id, 
        'firstname': current_user.first_name, 
        'lastname': current_user.last_name
    } if current_user.is_authenticated() else {}



class SessionAuthAPI(MethodView):
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': False}), 401

        if ('username' in request_data) and ('password' in request_data):
            user = User.query.filter_by(username=request_data['username']).first()
            if user and (request_data['password'] == user.password):
                login_user(user)
                # Leave property authenticated to be calculated by current_user.is_authenticated()
                return jsonify(**{'success': True, 'authenticated': current_user.is_authenticated(), 'user': current_user_props()})

        return jsonify(**{'success': False, 'authenticated': current_user.is_authenticated()}), 401

    @session_auth_required
    def get(self):
        return jsonify(**{'authenticated': True, 'user': current_user_props()})

    def delete(self):
        logout_user()
        return jsonify(**{'success': True, 'authenticated': current_user.is_authenticated()})

session_auth_view = SessionAuthAPI.as_view('session_auth_api')
app.add_url_rule('/api/session_auth/', view_func=session_auth_view, methods=['GET', 'POST', 'DELETE'])