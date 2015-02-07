from flask.ext.login import UserMixin

from backend import db, app, login_manager
import datetime



class User(db.Model, UserMixin):
    """
    Represents a player and their account information. 
    Instantiation of a User object should reflect an account registration.
    """
    id =            db.Column(db.Integer, primary_key=True)
    username =      db.Column(db.String(20), unique=True)
    password =      db.Column(db.String(255))
    email =         db.Column(db.String(60), unique=True)
    first_name =    db.Column(db.String(40))
    last_name =     db.Column(db.String(40))
    avatar_path =   db.Column(db.String(100))
    verification =  db.Column(db.String(255))
    date_joined =   db.Column(db.DateTime)
    new_user =      db.Column(db.Integer)

    # One-to-one relationship with a Presence model
    activity =      db.relationship('Presence', backref='user', uselist=False)
    # One-to-one relationship with a UserStatistics model
    stats =         db.relationship('UserStatistics', backref='user', uselist=False)
    # One-to-many relationship with many GameStatistics models
    wins =          db.relationship('GameStatistics', backref='user', lazy='dynamic')

    def __init__(self, username, password, email, first_name, last_name):
        """
        Create a new User. Represents an account registration.
        Arguments should be validated elsewhere prior to instantiation.
        """
        self.username =     username
        self.password =     password
        self.email =        email
        self.first_name =   first_name
        self.last_name =    last_name
        self.date_joined =  datetime.datetime.now()
        self.new_user =     1

    def __repr__(self):
        """
        String representation in console.
        """
        return '<User: {0}>'.format(self.username)

    def set_avatar_local_path(self, path):
        """
        Change the path of a User's avatar.
        Arguments should be validated elsewhere prior to instantiation.
        Base path is defined in app.config['AVATAR_UPLOADS'].
        """
        self.avatar_path = path

    def get_avatar_local_path(self):
        """
        Get the path of a User's avatar.
        Arguments should be validated elsewhere prior to instantiation.
        Base path is defined in app.config['AVATAR_UPLOADS'].
        """
        return self.avatar_path

@login_manager.user_loader
def load_user(userid):
    return User.query.get(userid)



class Presence(db.Model):
    """
    Represents a player's activity in the game.
    Has a strong one-to-one mapping with a User.
    """
    id =        db.Column(db.Integer, primary_key=True)
    game_online =    db.Column(db.Boolean)
    web_online = db.Column(db.Boolean)
    game_last_seen = db.Column(db.DateTime)
    web_last_seen = db.Column(db.DateTime)

    # Foreign Key: One-to-one relationship with a User model
    user_id =   db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, user_id):
        """
        Create a new User. Represents an account registration.
        Arguments should be validated elsewhere prior to instantiation.
        """
        self.user_id = user_id

    # def __repr__(self):
    #     """
    #     String representation in console.
    #     """
    #     return '<Presence: {0} is {1} (last seen {2})>'.format(self.user, ('online' if self.web_online else 'offline'), self.web_last_seen)

    def set_game_online(self):
        """
        Mark the Presence model's game as online.        
        """
        self.game_online =   True 

    def set_game_offline(self):
        """
        Mark the Presence model's game as offline. Records the last-seen time at the time of the call.
        """
        self.game_online =   False 
        self.game_last_seen = datetime.datetime.now()

    def set_web_online(self):
        """
        Mark the Presence model's web as online.
        """
        self.web_online =   True

    def set_web_offline(self):
        """
        Mark the Presence model's web as offline. Records the last-seen time at the time of the call.
        """
        self.web_online =   False
        self.web_last_seen = datetime.datetime.now()



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

    # Many-to-many relationship with many User models
    users =         db.relationship('User', secondary=games, backref=db.backref('games', lazy='dynamic'))
    # One-to-one relationship with a GameStatistics model
    stats =         db.relationship('GameStatistics', backref='game', uselist=False)

    def __repr__(self):
        """
        String representation in console.
        """
        return '<Game: {0} played {1}>'.format(self.id, self.time_played)



class GameStatistics(db.Model):
    """
    Contains statistics for a single game played.
    Has a strong one-to-one mapping with a Game.
    """
    id =                db.Column(db.Integer, primary_key=True)

    # Foreign Key: One-to-one relationship with a User model
    winner_user_id =    db.Column(db.Integer, db.ForeignKey('user.id'))
    # Foreign Key: One-to-one relationship with a Game model
    game_id =           db.Column(db.Integer, db.ForeignKey('game.id'))

    def __repr__(self):
        """
        String representation in console.
        """
        return '<GameStatistics: {0}>'.format(self.id)



class UserStatistics(db.Model):
    """
    Contains running statistics for a User's history.
    Has a strong one-to-one mapping with a User.    
    """
    id =                db.Column(db.Integer, primary_key=True)
    games_played =      db.Column(db.Integer)
    wins =              db.Column(db.Integer)
    win_loss_ratio =    db.Column(db.Float)

    # Foreign Key: One-to-one relationship with a User model
    user_id =   db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, user_id):
        """
        Create a new User. Represents an account registration.
        Arguments should be validated elsewhere prior to instantiation.
        """
        self.user_id = user_id
        self.wins = 0
        self.games_played = 0
		
    def __repr__(self):
        """
        String representation in console.
        """
		
        return '<UserStatistics: {0}>'.format(self.user)



class EmailSettings(db.model):
    """
    Contains User's e-mail notification EmailSettings
    Has one-to-one mapping with user
    """
    id =                db.Column(db.Integer, primary_key=True)
    n_hour =            db.Column(db.Integer)

    # Foreign Key: One-to-one relationship with a User model
    user_id =   db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        """
        String representation in console.
        """
        return '<EmailSettings: {0}>'.format(self.user)



class ChatMessages(db.model):
    """
    Contains chat messages and users involved
    """
    id =                db.Column(db.Integer, primary_key=True)
    to_user =           db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user =         db.Column(db.Integer, db.ForeignKey('user.id'))
    message =           db.Column(db.String(512))

    def __repr__(self):
        """
        String representation in console.
        """
        return '<CnatMessages: {0}>'.format(self.user)
