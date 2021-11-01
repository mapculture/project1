from flask import Blueprint

# Blueprint configuration
# https://exploreflask.com/en/latest/blueprints.html

map_blueprint = Blueprint(
    'map_blueprint',
     __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/map/static'
)

from . import views
