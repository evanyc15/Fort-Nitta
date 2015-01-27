from flask import request, jsonify, send_from_directory, abort
from flask.views import MethodView
from flask.ext.login import current_user
from werkzeug.utils import secure_filename

from backend import db, app
from backend.database.models import User
from sessionauth import session_auth_required

import os



class AvatarAPI(MethodView):
    @session_auth_required
    def post(self):
        file = request.files['file']
        ext = (file.filename.rsplit('.', 1)[1]) if ('.' in file.filename) else None

        if ext not in ['jpg', 'jpeg', 'png', 'gif']:
            return jsonify(**{'success': False}), 422

        # In case for whatever reason a username is made of Unix relative directory markers
        filename = secure_filename(current_user.username) + '.' + ext
        file.save(os.path.join(app.config['AVATAR_UPLOADS'], filename))

        current_user.set_avatar_local_path(filename)
        db.session.add(current_user)
        db.session.commit()

        # return send_from_directory(app.static_folder+'/avatar/', filename)
        return jsonify(**{'success': True, 'username': current_user.username})

    def get(self, username):
        user = User.query.filter_by(username=username).first()
        if not user:
            abort(404)

        filename = user.get_avatar_local_path()
        if not filename:
            abort(404)
            
        return send_from_directory(app.static_folder+'/avatar/', filename)

avatar_view = AvatarAPI.as_view('avatar_api')
app.add_url_rule('/api/avatar/', view_func=avatar_view, methods=['POST'])
app.add_url_rule('/api/avatar/<username>', view_func=avatar_view, methods=['GET'])