'''
CIS 422 Project 1: TSP Problem
mapculture.co

Flask application object creation

All view functions (the ones with a route() decorator on top) have to be imported into this file

Standard flask project structure:
https://flask.palletsprojects.com/en/2.0.x/patterns/packages/
'''

from flask import Flask


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
        #from .home import home_blueprint

        # register blueprints
        app.register_blueprint(getmap_blueprint)
        app.register_blueprint(testmap_blueprint)
        return app
