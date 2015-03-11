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
    #wins =          db.relationship('GameStatistics', backref='user', lazy='dynamic')

    #One-to-many relationship with a Forums Threads model
    user_forums_threads = db.relationship('ForumsThreads', backref='user', lazy='dynamic')

    #One-to-many relationship with a Forums Posts model
    user_forums_posts = db.relationship('ForumsPosts', backref='user', lazy='dynamic')

    #One-to-One relationship with a User Privileges model
    user_privileges = db.relationship('UserPrivileges', backref='user', lazy='dynamic')

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



## Many-to-many table relating games that users have played.
#games = db.Table('games',
 #   db.Column('game_id', db.Integer, db.ForeignKey('game.id')),
  #  db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
#)

class Game(db.Model):
    """
    Represents a record of some game played.
    Has a many-to-many relationship with Users and a one-on-one relationship with some
    single-game statistics.
    """
    id =            db.Column(db.Integer, primary_key=True)
    time_played =   db.Column(db.DateTime)
    num_players = db.Column(db.Integer)
    winner_id = db.Column(db.Integer, db.ForeignKey('user.id'))


    game_info = db.relationship('GameInfo', backref='game', lazy='dynamic')
    # Many-to-many relationship with many User models
    #users =         db.relationship('User', secondary=games, backref=db.backref('games', lazy='dynamic'))
    # One-to-one relationship with a GameStatistics model
    #stats =         db.relationship('GameStatistics', backref='game', uselist=False)

    def __repr__(self):
        """
        String representation in console.
        """
        return '<Game: {0} played {1}>'.format(self.id, self.time_played)



class GameInfo(db.Model):
    """
    Contains statistics for a single game played.
    Has a strong one-to-one mapping with a Game.
    """
    id =                db.Column(db.Integer, primary_key=True)

    # Foreign Key: One-to-one relationship with a User model
    #winner_user_id =    db.Column(db.Integer, db.ForeignKey('user.id'))
    # Foreign Key: One-to-one relationship with a Game model
    game_id =           db.Column(db.Integer, db.ForeignKey('game.id'))
    #Foreign Key: user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    numCannons = db.Column(db.Integer)
    numFires = db.Column(db.Integer)
    numWalls = db.Column(db.Integer)

    def __repr__(self):
        """
        String representation in console.
        """
        return '<GameInfo: {0}>'.format(self.id)



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
        self.win_loss_ratio = 0
		
    def __repr__(self):
        """
        String representation in console.
        """
		
        return '<UserStatistics: {0}>'.format(self.user)



class Settings(db.Model):
    """
    Contains User's e-mail notification EmailSettings
    Has one-to-one mapping with user
    """
    id =                db.Column(db.Integer, primary_key=True)
    n_hour =            db.Column(db.String)
    # Foreign Key: One-to-one relationship with a User model
    user_id =   db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        """
        String representation in console.
        """

        return '<EmailSettings: {0}>'.format(self.user)

    def __init__(self, user_id, n_hour = "2-hour"):
        """
        Sets n_hour and username
        """
        self.user_id =      user_id
        self.n_hour =       n_hour


class ChatMessages(db.Model):
    """
    Contains chat messages and users involved
    """
    id =                db.Column(db.Integer, primary_key=True)
    to_user =           db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user =         db.Column(db.Integer, db.ForeignKey('user.id'))
    message =           db.Column(db.String(512))
    date_created =      db.Column(db.DateTime)
    read =              db.Column(db.Boolean)

    def __init__(self, to_user, from_user, message):
        """
        Create a new Message. Represents an chat message between two users.
        Arguments should be validated elsewhere prior to instantiation.
        """
        self.to_user =          to_user
        self.from_user =        from_user
        self.message =          message
        self.date_created =     datetime.datetime.now()
        self.read =             False


    def __repr__(self):
        """
        String representation in console.
        """
        return '<ChatMessages: {0}>'.format(self.to_user)

class ForumsCategories(db.Model):
    """
    Contains the categories for forums
    """
    id =                db.Column(db.Integer, primary_key=True)
    category_name =     db.Column(db.String(512))

    #One-to-many relationship with a Forums Threads model
    forums_threads = db.relationship('ForumsThreads', backref='forums_categories', lazy='dynamic')

class ForumsThreads(db.Model):
    """
    Contains the threads for forums
    """
    id =                db.Column(db.Integer, primary_key=True)
    category_id =       db.Column(db.Integer, db.ForeignKey('forums_categories.id'))
    user_id =           db.Column(db.Integer, db.ForeignKey('user.id'))
    lastpost_id =       db.Column(db.Integer)
    title =             db.Column(db.String(512))
    replies =           db.Column(db.Integer)
    views =             db.Column(db.Integer)
    date_created =      db.Column(db.DateTime)    

    #One-to-many relationship with a Forums Posts model
    forums_posts = db.relationship('ForumsPosts', backref='forums_threads', lazy='dynamic')

    def __init__(self, category_id, user_id, title):
        """
        Create a new Forum Thread under a specific Forum Category
        """
        self.category_id =      category_id
        self.user_id =          user_id
        self.title =            title
        self.replies =          0
        self.views =            0
        self.date_created =     datetime.datetime.now()

class ForumsPosts(db.Model):
    """
    Contains the posts for forums
    """
    id =                db.Column(db.Integer, primary_key=True)
    thread_id =         db.Column(db.Integer, db.ForeignKey('forums_threads.id'))
    user_id =           db.Column(db.Integer, db.ForeignKey('user.id'))
    message =           db.Column(db.String(4096))
    date_created =      db.Column(db.DateTime)


    #One-to-many relationship with a Forums Posts Likes model
    forums_postsLikes = db.relationship('ForumsPostsLikes', backref='posts_likes', lazy='dynamic')
    #One-to-many relationship with a Forums Posts Images model
    forums_postsImages = db.relationship('ForumsPostsImages', backref='posts_images', lazy='dynamic')

    def __init__(self, thread_id, user_id, message):
        """
        Create a new Forum Post under a specific Forum Thread
        """
        self.thread_id =        thread_id
        self.user_id =          user_id
        self.message =          message
        self.date_created =     datetime.datetime.now()

class ForumsPostsLikes(db.Model):
    """
    Contains the images for posts in the forums
    """
    id =                db.Column(db.Integer, primary_key=True)
    post_id =           db.Column(db.Integer, db.ForeignKey('forums_posts.id'))
    user_id =           db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, post_id, user_id):
        """
        Creates a like that is affiliated with a post
        """
        self.post_id =      post_id
        self.user_id =      user_id

class ForumsPostsImages(db.Model):
    """
    Contains the images for a post
    """
    id =            db.Column(db.Integer, primary_key=True)
    post_id =       db.Column(db.Integer, db.ForeignKey('forums_posts.id'))
    image_path =    db.Column(db.String(2048))

    def __init__(self, post_id, image_path):
        """
        Creates an image affiliated with a post
        """
        self.post_id = post_id
        self.image_path = image_path

class GlobalAnnouncements(db.Model):
    """
    Contains the global GlobalAnnouncements
    """
    id =            db.Column(db.Integer, primary_key=True)
    subject =       db.Column(db.String(2048))
    posted_by =     db.Column(db.String(1024))
    date_created =  db.Column(db.DateTime)

    #One-to-many relationship with a Global Announcemnts Posts model
    global_announcements = db.relationship('GlobalAnnouncementsPosts', backref='global_announcements', lazy='dynamic')

    def __init__(self, subject, posted_by):
        self.subject = subject
        self.posted_by = posted_by
        self.date_created = datetime.datetime.now()

class GlobalAnnouncementsPosts(db.Model):
    """
    Contains the bullet point messages for each global announcement subject/topic
    """
    id =            db.Column(db.Integer, primary_key=True)
    message =       db.Column(db.String(4096))
    gbAnn_id=       db.Column(db.Integer, db.ForeignKey('global_announcements.id'))

class Todo(db.Model):
    """
    Contains a list of to do items and bug fixes needed
    """
    id =                    db.Column(db.Integer, primary_key=True)
    todo_message =          db.Column(db.String(4096))
    todo_type =             db.Column(db.String(512))
    todo_status =           db.Column(db.String(512))
    date_created =          db.Column(db.DateTime)

    def __init__(self, todo_message, todo_type, todo_status, date_created):
        self.todo_message = todo_message
        self.todo_type = todo_type
        self.todo_status = todo_status
        self.date_created = datetime.datetime.now()

class UserPrivileges(db.Model):
    """
    Contains the privileges for each user (like admin access)
    """
    id =            db.Column(db.Integer, primary_key=True)
    user_id =       db.Column(db.Integer, db.ForeignKey('user.id'))
    admin_access =  db.Column(db.Boolean)

    def __init__(self, user_id):
        self.user_id = user_id
        self.admin_access = False
