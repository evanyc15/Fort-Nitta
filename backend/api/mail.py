from flask import request, jsonify
from flask.views import MethodView
from flask_mail import Message

from backend import db, app, mail
from backend.database.models import User



class PasswordRecApi(MethodView):
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': False }), 401

        if ('email' in request_data):
            email = User.query.filter_by(email=request_data['email']).first()
            if email:
                msg = Message(
                'Test email',
                sender='ecs160server.winter2015@gmail.com',
                recipients= [request_data['email']])
                msg.body = "Testing email"
                mail.send(msg)
                return jsonify(**{'success': True})

        return jsonify(**{'success': False}), 401

password_rec_view = PasswordRecApi.as_view('password_rec_api')
app.add_url_rule('/api/mail/', view_func=password_rec_view, methods=['POST'])