## @package mail.py
# Used to mail users verification emails and notifications
from flask import request, jsonify
from flask.views import MethodView
from flask_mail import Message

from sqlalchemy import and_, or_, func
from backend import db, app, mail, bcrypt
from backend.database.models import User, Settings, ChatMessages
from backend.api.sessionauth import hash_password
import validation
import threading
import logger
import datetime

## Used for password recovery
class PasswordRecApi(MethodView):
    ## Used to send recovery email
    def post(self):
        url = "http://optical.cs.ucdavis.edu/"
        # url = "http://localhost:5000/"
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

## Verifies email in database
class VerifyEmailApi(MethodView):
    ## sets the email to a verified state in the DB
    def post(self):
        url = "http://optical.cs.ucdavis.edu/" 
        # url = "http://localhost:5000/"

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

running = False
## Emailing scheduling starter
def startEmailing(running):
    if not running:
        running = True
        threading.Timer(1, lambda: sendEmail(0,"immediate",2)).start()
        threading.Timer(1, lambda: sendEmail(0,"1-hour",3600)).start()
        threading.Timer(1, lambda: sendEmail(0,"2-hour",7200)).start()
        threading.Timer(1, lambda: sendEmail(0,"4-hour",14400)).start()
        threading.Timer(1, lambda: sendEmail(0,"12-hour",43200)).start()
        threading.Timer(1, lambda: sendEmail(0,"24-hour",86400)).start()

## Function which sends the emails
def sendEmail(PK, intervalID, intervalInSecs):
   with app.app_context():
    queryObject = User.query.join(Settings, User.id==Settings.user_id).join(ChatMessages, Settings.user_id==ChatMessages.to_user).filter(and_(Settings.n_hour==intervalID, ChatMessages.id > PK)).all()
    maxPK = db.session.query(db.func.max(ChatMessages.id)).scalar()
    
    url = "http://optical.cs.ucdavis.edu"
    # url = "http://localhost:5000/" 
    string = ""
    emailArray = []
    for i in queryObject:
        emailArray.append(i.email);
    if len(emailArray) > 0:
        msg = Message('Fort Nitta New Message!',
                        sender='ecs160server.winter2015@gmail.com',
                        recipients= emailArray
                     )
        msg.body = ("Hey Fort Nitta user,\n\n" +
                    "   You have new unread messages waiting!\n   " +
                    "   Visit Fort Nitta now to check!\n   " + 
                    "\n\nAll the best,\n" + "Fort Nitta Team,\n"+url)
        mail.send(msg)
    
    threading.Timer(intervalInSecs, lambda: sendEmail(maxPK,intervalID,intervalInSecs)).start();

# kick of email scheduling
startEmailing(running) 

# Routing and view binding
password_rec_view = PasswordRecApi.as_view('password_rec_api')
app.add_url_rule('/api/recpassmail/', view_func=password_rec_view, methods=['POST'])

verify_email_view = VerifyEmailApi.as_view('verify_email_api')
app.add_url_rule('/api/veremailacc/', view_func=verify_email_view, methods=['POST'])

