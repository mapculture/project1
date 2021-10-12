from flask import Blueprint

# Blueprint configuration
# https://exploreflask.com/en/latest/blueprints.html

getmap_blueprint = Blueprint(
    'getmap_blueprint',
     __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/getmap/static'
)

from . import views
