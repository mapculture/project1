'''
File name: map/__init__.py (map package)

Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file tells Python that the /map directory is a Python package.
(Allows us to import the map blueprint from the parent flask app directory)

In this file, we create and configure a blueprint for the Auth package.

Reference: https://exploreflask.com/en/latest/blueprints.html

Creation Date: 10/12/2021
Last Modified: 11/01/2021
'''

from flask import Blueprint

# Blueprint configuration
map_blueprint = Blueprint(
    # blueprint name
    'map_blueprint',
    # import_name (current Python module)
     __name__,
    # use the template folder local to map/
    template_folder='templates',
    # use the static folder local to map/
    static_folder='static',
    # configure the url path for map's static folder
    # (the html references this)
    static_url_path='/map/static'
)

# Import the views module (routing functions) for the map blueprint 
# We import this at the bottom of the file because map/views.py imports the map_blueprint 
# The blueprint must be defined before importing.
from . import views
