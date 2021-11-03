'''
File name: about/__init__.py (about package)

Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file tells Python that the /about directory is a Python package.
(Allows us to import the about blueprint from the parent flask app directory)

In this file, we create and configure a blueprint for the About package.

Reference: https://exploreflask.com/en/latest/blueprints.html

Creation Date: 10/27/2021
Last Modified: 10/27/2021
'''
from flask import Blueprint

# Blueprint configuration
about_blueprint = Blueprint(
    # blueprint name
    'about_blueprint',
    # import_name (current Python module)
     __name__,
    # use the templates directory local to /about/
    template_folder='templates',
    # use the static directory local to /about/
    static_folder='static',
    # configure the url path for about's static folder
    # (the html references this)
    static_url_path='/about/static'
)

# import the module views (routing functions) for the /about blueprint 
# We import this at the bottom of the file because /about/views.py imports the about_blueprint
# The blueprint must be defined before importing.
from . import views
