from flask import request, jsonify
from flask.views import MethodView
from flask_mail import Message

from backend import db, app, mail, bcrypt
from backend.database.models import User
from backend.api.sessionauth import hash_password
import validation

import datetime



class PasswordRecApi(MethodView):
    def post(self):
        url = "http://localhost:5000/"
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': False }), 401

        if ('email' in request_data):
            email = request_data['email']
            if not validation.valid_email(email):
                return jsonify(**{'success': False}), 401

            user = User.query.filter_by(email=email).first()
            if user:
                hash_token = bcrypt.generate_password_hash(email + datetime.datetime.now().strftime('%m/%d/%Y')).replace("/",".")
                current_user = User.query.filter_by(email=email).first()
                if current_user:
                    current_user.verification = hash_token
                    db.session.commit()
                    msg = Message('Password Recovery for Fort Nitta',
                        sender='ecs160server.winter2015@gmail.com',
                        recipients= [email]
                    )
                    msg.body = ("Hey Fort Nitta user,\n\n" +
                    "   To reset your password, please visit the following link:\n   " + 
                    url + "#home/changepassword?" + "user=" + user.username + "&tok=" +
                    hash_token +
                    "\n\nAll the best,\n" + "Fort Nitta Team,\n"+url)
                    mail.send(msg)
                    return jsonify(**{'success': True})
                return jsonify(**{'success': False}), 401
        return jsonify(**{'success': False}), 401

class VerifyEmailApi(MethodView):
    def post(self):
        url = "http://localhost:5000/"
        request_data = request.get_json(force=True, silent=True)
        if request_data is None:
            return jsonify(**{'success': False }), 401

        if ('email' in request_data):
            email = request_data['email']
            if not validation.valid_email(email):
                return jsonify(**{'success': False}), 401

            user = User.query.filter_by(email=email).first()
            if user:
                hash_token = bcrypt.generate_password_hash(datetime.datetime.now().strftime('%m/%d/%Y') + "rand" + email +"rand").replace("/",".")
                current_user = User.query.filter_by(email=email).first()
                if current_user:
                    current_user.verification = hash_token
                    db.session.commit()
                    msg = Message('Email Verification for Fort Nitta Account',
                        sender='ecs160server.winter2015@gmail.com',
                        recipients= [email]
                    )
                    msg.body = ("Hey Fort Nitta user,\n\n" +
                    "   To verify your account, please visit the following link:\n   " + 
                    url + "#home/verifyemail?" + "user=" + user.username + "&tok=" +
                    hash_token +
                    "\n\nAll the best,\n" + "Fort Nitta Team,\n"+url)
                    mail.send(msg)
                    return jsonify(**{'success': True})
                return jsonify(**{'success': False}), 401
        return jsonify(**{'success': False}), 401


password_rec_view = PasswordRecApi.as_view('password_rec_api')
verify_email_view = VerifyEmailApi.as_view('verify_email_api')
app.add_url_rule('/api/recpassmail/', view_func=password_rec_view, methods=['POST'])
app.add_url_rule('/api/veremailacc/', view_func=verify_email_view, methods=['POST'])

