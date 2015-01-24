from backend import db, app

class User(db.Model):
    id =            db.Column(db.Integer, primary_key = True)
    username =      db.Column(db.String(20), unique = True)
    password =      db.Column(db.String(40))
    email =         db.Column(db.String(60), unique = True)
    first_name =    db.Column(db.String(40))
    last_name =     db.Column(db.String(40))

    def __init__(self, username, password, email, first_name, last_name):
        self.username =     username   
        self.password =     password
        self.email =        email
        self.first_name =   first_name 
        self.last_name =    last_name

