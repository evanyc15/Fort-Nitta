from flask import request, jsonify
from flask.views import MethodView
from sqlalchemy import and_
from flask.ext.login import current_user
from backend.api.sessionauth import current_user_props

from backend import db, app
from backend.database.models import User, UserStatistics


def user_statistics_props(user_stat):
  return {
      'id': user_stat.id,
      'games_played': user_stat.games_played,
      'wins': user_stat.wins,
      'win_loss_ratio': user_stat.win_loss_ratio
  }

class UserStatisticsAPI(MethodView):
    def get(self):
        user_stat = UserStatistics.query.filter(UserStatistics.user_id == current_user.id).first()

        if user_stat is None:
          return jsonify(**{'success': False})

        return jsonify(**{'success': True, 'user_statistics': user_statistics_props(user_stat)})


user_statistics_view = UserStatisticsAPI.as_view('user_statistics_api')
app.add_url_rule('/api/user_statistics/', view_func=user_statistics_view, methods=['GET'])