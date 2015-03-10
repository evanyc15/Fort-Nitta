## @package leaderboards.py
# Used to manage the leaderboard

from flask import request, jsonify
from flask.views import MethodView
from sqlalchemy import and_
from flask.ext.login import current_user
from backend.api.sessionauth import current_user_props

from backend import db, app
from backend.database.models import User, UserStatistics
import json

## Creates an object with all the info in the passed row
def buildLeaderboardsJSON(row):
    return {
        'rank' : 1,   
        'username': row.user.username,
        'win_percent': row.win_loss_ratio * 100,
        'num_wins': row.wins 
    }

## Used to create an object with all the information in the row and counter
def setRank(row, counter):
    return {
        'rank': counter,
        'username' : row['username'],
        'win_percent' : row['win_percent'],
        'num_wins' : row['num_wins']
    }

## Used to access leader board records
class LeaderboardsAPI(MethodView):
    ## Retrieves all entries for the leader board
    def get(self):
        leaderboards_array = []
        finalLeaderboardsArray= []
        leaderboards = UserStatistics.query.join(UserStatistics.user).filter(UserStatistics.id > 0).order_by(UserStatistics.win_loss_ratio.desc()).all()
        if leaderboards is not None: 
            for row in leaderboards:
                leaderboards_array.append(buildLeaderboardsJSON(row))
            
            counter = 0
            prevRow = 200    
            for row in leaderboards_array:
                if (row['win_percent'] < prevRow): 
                    counter = counter+1 
                    prevRow = row['win_percent']
                finalLeaderboardsArray.append(setRank(row, counter))
            return json.dumps(finalLeaderboardsArray)
        return jsonify(**{'success': False}), 401


leaderboards_view = LeaderboardsAPI.as_view('leaderboards_api')
app.add_url_rule('/api/leaderboards/', view_func=leaderboards_view, methods=['GET'])