from flask import request, jsonify, Response
from flask.views import MethodView
from sqlalchemy import and_, or_

from backend import db, app
from backend.database.models import Presence, User


class PresenceOnlineApi(MethodView):
    def get(self):
        presence_list = []

        user_presences = Presence.query.join(Presence.user).filter(or_(Presence.game_online == True, Presence.web_online == True)).all()
        if user_presences is None:
            return jsonify(**{'success': False}), 401

        for data in user_presences:
            json = {'username': data.user.username,'first_name': data.user.first_name, 'last_name': data.user.last_name, 'web_online': data.web_online, 'game_online': data.game_online}
            presence_list.append(json)
        return jsonify(results = presence_list)
        
        # return jsonify(**{'1': user_presences[0].user.username, '2': user_presences[0].web_online})

presence_online_view = PresenceOnlineApi.as_view('presence_online_api')
app.add_url_rule('/api/presence/online/', view_func=presence_online_view, methods=['GET'])