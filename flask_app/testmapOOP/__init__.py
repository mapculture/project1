from flask import Blueprint

# Blueprint configuration
# https://exploreflask.com/en/latest/blueprints.html

testmapOOP_blueprint = Blueprint(
    'testmapOOP_blueprint',
     __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/testmapOOP/static'
)

from . import views
