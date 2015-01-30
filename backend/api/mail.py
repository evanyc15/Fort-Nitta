from flask import request, jsonify
from flask.views import MethodView
from flask_mail import Message

from backend import db, app, mail, bcrypt
from backend.database.models import User
import validation

import datetime



class PasswordRecApi(MethodView):
    def post(self):
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': False }), 401

        if ('email' in request_data):
            email = request_data['email']
            if not validation.valid_email(email):
                return jsonify(**{'success': False}), 401

            user = User.query.filter_by(email=email).first()
            if user:
                msg = Message('Password Recovery for Fort Nitta',
                    sender='ecs160server.winter2015@gmail.com',
                    recipients= [request_data['email']]
                )
                msg.body = "Testing email" + bcrypt.generate_password_hash(request_data['email'] + datetime.datetime.now().strftime('%m/%d/%Y'))
                mail.send(msg)
                return jsonify(**{'success': True})

        return jsonify(**{'success': False}), 401

password_rec_view = PasswordRecApi.as_view('password_rec_api')
app.add_url_rule('/api/mail/', view_func=password_rec_view, methods=['POST'])