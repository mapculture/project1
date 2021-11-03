'''
File name: references/__init__.py (references package)

Author: Sofi Vinas, Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file tells Python that the /references directory is a Python package.
(Allows us to import the references blueprint from the parent flask app directory)

In this file, we create and configure a blueprint for the Auth package.

Reference: https://exploreflask.com/en/latest/blueprints.html

Creation Date: 10/27/2021
Last Edited: 10/27/2021
'''

from flask import Blueprint

# Blueprint configuration
references_blueprint = Blueprint(
    # blueprint name
    'references_blueprint',
    # import_name (current Python module)
     __name__,
    # use the template folder local to references/
    template_folder='templates',
    # use the static folder local to references/
    static_folder='static',
    # configure the url path for references's static folder
    # (the html references this)
    static_url_path='/references/static'
)


# Import the views (routing functions) for the references blueprint 
# We import this at the bottom of the file because references/views.py imports the references_blueprint 
# The blueprint must be defined before importing.
from . import views
