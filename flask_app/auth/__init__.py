'''
File name: auth/__init__.py (auth package)

Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file tells Python that the /auth directory is a Python package.
(Allows us to import the auth blueprint from the parent flask app directory)

In this file, we create and configure a blueprint for the Auth package.

Reference: https://exploreflask.com/en/latest/blueprints.html

Creation Date: 10/24/2021
Last Edited: 10/24/2021
'''
from flask import Blueprint

# Blueprint configuration
auth_blueprint = Blueprint(
    # blueprint name
    'auth_blueprint',
    # import_name (current Python module)
     __name__,
    # use the template folder local to auth/
    template_folder='templates',
    # use the static folder local to auth/
    static_folder='static',
    # configure the url path for auth's static folder
    # (the html references this)
    static_url_path='/auth/static'
)

# Import the views module (routing functions) for the auth blueprint 
# We import this at the bottom of the file because auth/views.py imports the auth_blueprint 
# The blueprint must be defined before importing.
from . import views
