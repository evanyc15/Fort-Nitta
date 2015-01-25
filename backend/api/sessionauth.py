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



class SessionAuthAPI(MethodView):
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': False}), 401

        if ('username' in request_data) and ('password' in request_data):
            user = User.query.filter_by(username=request_data['username']).first()
            if request_data['password'] == user.password:
                login_user(user)

                return jsonify(**{'success': True})

        return jsonify(**{'success': False}), 401

    @session_auth_required
    def get(self):
        return jsonify(**{'authenticated': True, 'username': current_user.username})

    def delete(self):
        logout_user()
        return jsonify(**{'success': True})

session_auth_view = SessionAuthAPI.as_view('session_auth_api')
app.add_url_rule('/api/session_auth/', view_func=session_auth_view, methods=['GET', 'POST', 'DELETE'])
