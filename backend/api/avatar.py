from flask import request, jsonify, send_from_directory, abort
from flask.views import MethodView
from flask.ext.login import current_user
from werkzeug.utils import secure_filename

from backend import db, app
from backend.database.models import User
from sessionauth import session_auth_required, current_user_props
from PIL import Image

import os



class AvatarAPI(MethodView):
    @session_auth_required
    def post(self):
        file = request.files['file']
        ext = (file.filename.rsplit('.', 1)[1]) if ('.' in file.filename) else None

        if ext not in ['jpg', 'jpeg', 'png', 'gif']:
            return jsonify(**{'success': False}), 422

         # PIL Image Compression
        image = Image.open(file)
        # Calculate the height using the same aspect ratio
        widthPercent = (640 / float(image.size[0]))
        height = int((float(image.size[1]) * float(widthPercent)))
        image = image.resize((640, height), Image.ANTIALIAS)

        # In case for whatever reason a username is made of Unix relative directory markers
        filename = file.filename + secure_filename(current_user.username) + '.' + ext
        print os.path.join(app.config['AVATAR_UPLOADS'], filename)

        image.save(os.path.join(app.config['AVATAR_UPLOADS'], filename), optimize=True, quality=65)


        current_user.set_avatar_local_path(filename)
        db.session.add(current_user)
        db.session.commit()

        return jsonify(**{'success': True, 'user': current_user_props()})

avatar_view = AvatarAPI.as_view('avatar_api')
app.add_url_rule('/api/avatar/', view_func=avatar_view, methods=['POST'])
