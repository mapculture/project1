'''
CIS 422 Project 1: TSP Problem
mapculture.co

Flask application object creation

All view functions (the ones with a route() decorator on top) have to be imported into this file

Standard flask project structure:
https://flask.palletsprojects.com/en/2.0.x/patterns/packages/
'''

from flask import Flask, render_template

# https://flask.palletsprojects.com/en/2.0.x/errorhandling/
def page_not_found(e):
    return render_template('404.html'), 404

def method_not_allowed(e):
    # if a request has the wrong method
    return render_template('405.html'), 405

def method_not_allowed(e):
    return render_template('405.html'), 405

def internal_server_error(e):
    return render_template('500.html'), 500


# create and configure the Flask app
def create_app(test_config=None):
   
    # Create the Flask instance:
    #   __name__ tells the Flask app how to create relative paths 
    app = Flask(__name__, instance_relative_config=False)
    # configure flask app with configuration found in config.py
    app.config.from_pyfile('config.py')

    with app.app_context():
        # import blueprints
        from .getmap import getmap_blueprint 
        from .testmap import testmap_blueprint
        from .testmapOOP import testmapOOP_blueprint
        from .auth import auth_blueprint

        app.register_error_handler(404,page_not_found)
        app.register_error_handler(405,method_not_allowed)
        app.register_error_handler(500,internal_server_error)

        # register blueprints
        app.register_blueprint(getmap_blueprint)
        app.register_blueprint(testmap_blueprint)
        app.register_blueprint(testmapOOP_blueprint)
        app.register_blueprint(auth_blueprint)
        return app

#https://flask.palletsprojects.com/en/2.0.x/errorhandling/#blueprint-error-handlers

    
