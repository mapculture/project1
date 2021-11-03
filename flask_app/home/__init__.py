'''
File name: home/__init__.py (home package)

Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file tells Python that the /home directory is a Python package.
(Allows us to import the home blueprint from the parent flask app directory)

In this file, we create and configure a blueprint for the Auth package.

Reference: https://exploreflask.com/en/latest/blueprints.html

Creation Date: 10/27/2021
Last Edited:   10/27/2021
'''

from flask import Blueprint

# Blueprint configuration

home_blueprint = Blueprint(
    # blueprint name
    'home_blueprint',
    # import_name (current Python module)
     __name__,
    # use the template folder local to home/
    template_folder='templates',
    # use the static folder local to home/
    static_folder='static',
    # configure the url path for home's static folder
    # (the html references this)
    static_url_path='/home/static'
)

# Import the views module (routing functions) for the home blueprint 
# We import this at the bottom of the file because home/views.py imports the home_blueprint 
# The blueprint must be defined before importing.
from . import views
