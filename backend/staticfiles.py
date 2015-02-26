from flask import send_from_directory

from backend import app

import os



def serve_static_path(directory, path):
    return app.send_static_file(os.path.join(directory, path).replace('\\','/'))



@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/js/<path:path>')
def static_js(path):
    return serve_static_path('js', path)

@app.route('/css/<path:path>')
def static_css(path):
    return serve_static_path('css', path)

@app.route('/img/<path:path>')
def static_img(path):
    return serve_static_path('img', path)

@app.route('/api/avatar/<path:path>')
def avatar_proxy(path):
    return send_from_directory(app.config['AVATAR_UPLOADS'], path)

@app.route('/api/forums/postsimages/<path:path>')
def forums_images_proxy(path):
    return send_from_directory(app.config['FORUMS_IMG_UPLOADS'], path)
