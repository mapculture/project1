from flask import Blueprint

# Blueprint configuration
# https://exploreflask.com/en/latest/blueprints.html

about_blueprint = Blueprint(
    'about_blueprint',
     __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/about/static'
)

from . import views
