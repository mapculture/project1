"""
CIS 422 Project 1: TSP Problem
mapculture.co

Flask setup
"""

import os
import flask

# create and configure the Flask app
def create_app(test_config=None):
   
    # Create the Flask instance:
    #   __name__ tells the Flask app how to create relative paths 
    #   instance_relative_config=True tells the app that configuration files are relative to the 'instance' folder
    app = flask.Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        # SECRET_KEY is used by Flask to keep cookies/data safe
        # 'dev' is a placeholder, set to something random when officially deploying the app
        SECRET_KEY = 'dev',
        #DATABASE=os.path.join(app.instance_path,'database_file.filetype'),
    )

    if test_config is None:
        # override the default configuration
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # create a connection/route between URL/ and the function index() that returns a response
    # load the getmap.html at the root of the website
    @app.route("/")
    def index():
        return flask.render_template('getmap.html')
    
    return app

###############
# AJAX request handlers
#   These return JSON to the JavaScript function on
#   an existing page, rather than rendering a new page.
###############

# API_KEY = "INSERT API KEY HERE"
# IGNORE: old static map API stuff
#@app.route("/_getmap")
#def getmap():
#    coords = flask.request.args.get("coords", type=str)
        
#    prefix = "https://maps.googleapis.com/maps/api/staticmap?"
#    size = "zoom=13&size=400x400&"
#    marker_color="markers=color:blue%7C"
#    marker_label ="label:A%7C"
#    api_key = "&key=" + API_KEY 

#    map_image_url = prefix + size + marker_color + marker_label + coords + api_key 

#    rslt = {"map_image_url": map_image_url}
#    return flask.jsonify(result=rslt)

#############


#if __name__ == "__main__":
#    # Standalone (not running under green unicorn or similar)
#    app.run(host="0.0.0.0")
