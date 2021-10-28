from flask import Blueprint

# Blueprint configuration
# https://exploreflask.com/en/latest/blueprints.html

references_blueprint = Blueprint(
    'references_blueprint',
     __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/references/static'
)

from . import views
