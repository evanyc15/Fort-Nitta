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

    def __repr__(self):
        """
        String representation in console.
        """
        return '<User: {0}>'.format(self.username)

    def set_avatar_url(self, url):
        """
        Change the URL of a User's avatar.
        Arguments should be validated elsewhere prior to instantiation.
        """
        self.avatar_url = url



class Presence(db.Model):
    """
    Represents a player's activity in the game.
    Has a strong one-to-one mapping with a User.
    """
    id =        db.Column(db.Integer, primary_key=True)
    online =    db.Column(db.Boolean)
    last_seen = db.Column(db.DateTime)

    # Foreign Key: One-to-one relationship with a User model
    user_id =   db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        """
        String representation in console.
        """
        return '<Presence: {0} is {1} (last seen {2})>'.format(self.user, ('online' if self.online else 'offline'), self.last_seen)

    def set_online(self):
        """
        Mark the Presence model as online.        
        """
        self.online =   True 

    def set_offline(self):
        """
        Mark the Presence model as offline. Records the last-seen time at the time of the call.
        """
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

    def __repr__(self):
        """
        String representation in console.
        """
        return '<UserStatistics: {0}>'.format(self.user)
