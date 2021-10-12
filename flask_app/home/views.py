from . import home_bp
from flask import render_template

# create a connection/route between URL/ and the function index() that returns a response
@home_bp.route('/', methods=['GET'])
def home():
    # load the index.html at the root of the website
    return render_template('index.html') 
