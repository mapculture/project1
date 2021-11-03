'''
File name: __init__.py (main Flask app module)

Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file creates and configures the Flask application object.

Flask Blueprints of each Flask submodule are imported and registered to this file.
Each blueprint handles the routing (view functions) for each submodule.

Resources used to help create this file:

Standard flask project structure:
https://flask.palletsprojects.com/en/2.0.x/patterns/packages/

The flask app follows a divisional organizational structure: 
https://exploreflask.com/en/latest/blueprints.html#divisional

Creation Date: 10/05/2021
Last Edited: 11/02/2021
'''

from flask import Flask, render_template

# HTTP error handling
# https://flask.palletsprojects.com/en/2.0.x/errorhandling/

# 404 (page not found)
def page_not_found(e):
    # direct the user to the 404 page
    return render_template('404.html'), 404

# 405 (HTTP method not allowed)
def method_not_allowed(e):
    # if a request has the wrong method
    # direct the user to the 405 page
    return render_template('405.html'), 405

# 500 (internal server error (catch-all))
def internal_server_error(e):
    # direct the user to the 500 page
    return render_template('500.html'), 500


# create and configure the Flask app
def create_app(test_config=None):
   
    # Create the Flask instance:
    #   __name__ tells the Flask app how to create relative paths 
    app = Flask(__name__, instance_relative_config=False)
    # configure flask app with configuration found in config.py
    app.config.from_pyfile('config.py')

    # reference the current app context
    # (flask can have multiple apps running in the same process)
    with app.app_context():
        # import blueprints for all flask app modules
        # modules: home, about, map, auth, references (represent each page in webapp)
        from .home import home_blueprint
        from .about import about_blueprint
        from .map import map_blueprint
        from .auth import auth_blueprint
        from .references import references_blueprint

        # register error handlers for 404, 405, and 500
        app.register_error_handler(404,page_not_found)
        app.register_error_handler(405,method_not_allowed)
        app.register_error_handler(500,internal_server_error)

        # register the imported blueprints
        app.register_blueprint(home_blueprint)
        app.register_blueprint(about_blueprint)
        app.register_blueprint(map_blueprint)
        app.register_blueprint(auth_blueprint)
        app.register_blueprint(references_blueprint)

        # return the flask app
        return app

