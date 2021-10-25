from flask import Blueprint

# Blueprint configuration
# https://exploreflask.com/en/latest/blueprints.html

auth_blueprint = Blueprint(
    'auth_blueprint',
     __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/auth/static'
)

from . import views
