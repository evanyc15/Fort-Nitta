from backend import db, app
import datetime



class User(db.Model):
    id =            db.Column(db.Integer, primary_key=True)
    username =      db.Column(db.String(20), unique=True)
    password =      db.Column(db.String(40))
    email =         db.Column(db.String(60), unique=True)
    first_name =    db.Column(db.String(40))
    last_name =     db.Column(db.String(40))
    avatar_url =    db.Column(db.String(100))

    activity =      db.relationship('Presence', backref='user', lazy='dynamic', uselist=False)
    stats =         db.relationship('UserStatistics', backref='user', lazy='dynamic', uselist=False)
    wins =          db.relationship('GameStatistics', backref='user', lazy='dynamic')

    def __init__(self, username, password, email, first_name, last_name):
        self.username =     username
        self.password =     password
        self.email =        email
        self.first_name =   first_name
        self.last_name =    last_name

    def __str__(self):
        return self.username

    def set_avatar_url(self, url):
        self.avatar_url = url



class Presence(db.Model):
    id =        db.Column(db.Integer, primary_key=True)
    online =    db.Column(db.Boolean)
    last_seen = db.Column(db.DateTime)

    user_id =   db.Column(db.Integer, db.ForeignKey('user.id'))

    def __str__(self):
        return self.user + ': ' + ('online' if self.online else 'offline') + ' (last seen ' + self.last_seen + ')'

    def set_online(self):
        self.online =   True 

    def set_offline(self):
        self.online =   False 
        self.datetime = datetime.datetime.now()



games = db.Table('games',
    db.Column('game_id', db.Integer, db.ForeignKey('game.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
)

class Game(db.Model):
    id =            db.Column(db.Integer, primary_key=True)

    stats =         db.relationship('GameStatistics', backref='game', lazy='dynamic', uselist=False)



class GameStatistics(db.Model):
    id =                db.Column(db.Integer, primary_key=True)

    time_played =       db.Column(db.DateTime)
    winner_user_id =    db.Column(db.Integer, db.ForeignKey('user.id'))
    game_id =           db.Column(db.Integer, db.ForeignKey('game.id'))



class UserStatistics(db.Model):
    id =                db.Column(db.Integer, primary_key=True)
    win_loss_ratio =    db.Column(db.Float)
    games_played =      db.Column(db.Integer)
    wins =              db.Column(db.Integer)

    user_id =   db.Column(db.Integer, db.ForeignKey('user.id'))
