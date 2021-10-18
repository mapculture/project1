from flask import Blueprint

# Blueprint configuration
# https://exploreflask.com/en/latest/blueprints.html

testmap_blueprint = Blueprint(
    'testmap_blueprint',
     __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/testmap/static'
)

from . import views
