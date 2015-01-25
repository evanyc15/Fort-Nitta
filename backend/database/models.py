from backend import db, app
import datetime



class User(db.Model):
    """
    Represents a player and their account information. 
    Instantiation of a User object should reflect an account registration.
    """
    id =            db.Column(db.Integer, primary_key=True)
    username =      db.Column(db.String(20), unique=True)
    password =      db.Column(db.String(40))
    email =         db.Column(db.String(60), unique=True)
    first_name =    db.Column(db.String(40))
    last_name =     db.Column(db.String(40))
    avatar_url =    db.Column(db.String(100))

    # 
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
    """
    Represents a player's activity in the game.
    Has a strong one-to-one mapping with a User.
    """
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



# Many-to-many table relating games that users have played.
games = db.Table('games',
    db.Column('game_id', db.Integer, db.ForeignKey('game.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
)

class Game(db.Model):
    """
    Represents a record of some game played.
    Has a many-to-many relationship with Users and a one-on-one relationship with some
    single-game statistics.
    """
    id =            db.Column(db.Integer, primary_key=True)
    time_played =   db.Column(db.DateTime)

    stats =         db.relationship('GameStatistics', backref='game', lazy='dynamic', uselist=False)



class GameStatistics(db.Model):
    """
    Contains statistics for a single game played.
    Has a strong one-to-one mapping with a Game.
    """
    id =                db.Column(db.Integer, primary_key=True)

    winner_user_id =    db.Column(db.Integer, db.ForeignKey('user.id'))
    game_id =           db.Column(db.Integer, db.ForeignKey('game.id'))



class UserStatistics(db.Model):
    """
    Contains running statistics for a User's history.
    Has a strong one-to-one mapping with a User.    
    """
    id =                db.Column(db.Integer, primary_key=True)
    games_played =      db.Column(db.Integer)
    wins =              db.Column(db.Integer)
    win_loss_ratio =    db.Column(db.Float)

    user_id =   db.Column(db.Integer, db.ForeignKey('user.id'))
