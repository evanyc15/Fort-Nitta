from flask import send_from_directory

from backend import app

import os



@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/js/<path:path>')
def static_js(path):
    return app.send_static_file(os.path.join('js', path))

@app.route('/css/<path:path>')
def static_css(path):
    return app.send_static_file(os.path.join('css', path))

@app.route('/img/<path:path>')
def static_img(path):
    return app.send_static_file(os.path.join('img', path))

@app.route('/api/avatar/<path:path>')
def avatar_proxy(path):
    return send_from_directory(app.config['AVATAR_UPLOADS'], path)
