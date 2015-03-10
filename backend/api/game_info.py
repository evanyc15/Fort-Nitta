## @package game_info.py
# Used to bundle together information about a specific game
from flask import request, jsonify
from flask.views import MethodView
from sqlalchemy import and_
from flask.ext.login import current_user
from backend.api.sessionauth import current_user_props

from backend import db, app
from backend.database.models import User, GameInfo, Game
import json

## Used to create a JSON formatted object with all the information in the row passed
def buildGameInfoJSON(row):
  return {
    'id': row.id,
    'game_id': row.game.id,
    'user_id': row.user_id,
    'numCannons': row.numCannons,
    'numFires': row.numFires,
    'numWalls': row.numWalls,
    'num_players': row.game.num_players,
    'time_played': row.game.time_played.strftime("%Y-%m-%d %H:%M:%S"),
    'winner_id': row.game.winner_id
  }

## Interface for retrieving game information from the database
class GameInfoAPI(MethodView):
  ## Returns all games corresponding to a specific user_id
  def get(self):
    game_info_array = []
    user_id = request.args.get('id')
    if user_id is "" or user_id is None:
      return jsonify(**{'success': 'none'}), 401

    game_info = GameInfo.query.join(Game.game_info).filter(GameInfo.user_id==user_id).all()

    if game_info is not None: 
      for row in game_info:
        game_info_array.append(buildGameInfoJSON(row))
      return json.dumps(game_info_array)
    return jsonify(**{'success': False}), 401

# Routing and view binding
game_info_view = GameInfoAPI.as_view('game_info_api')
app.add_url_rule('/api/game_info/', view_func=game_info_view, methods=['GET'])
