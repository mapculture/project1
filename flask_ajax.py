"""
Tiny demo of Ajax interaction
"""

import flask
import logging
#import config


###
# Globals
###
app = flask.Flask(__name__)
#CONFIG = config.configuration()
#app.secret_key = CONFIG.SECRET_KEY  # Sign my cookies
API_KEY = "INSERT API KEY HERE"  


###
# Pages
###

@app.route("/")
def index():
    return flask.render_template('getmap.html')

###############
# AJAX request handlers
#   These return JSON to the JavaScript function on
#   an existing page, rather than rendering a new page.
###############


# IGNORE: old static map API stuff
@app.route("/_getmap")
def getmap():
    coords = flask.request.args.get("coords", type=str)
        
    prefix = "https://maps.googleapis.com/maps/api/staticmap?"
    size = "zoom=13&size=400x400&"
    marker_color="markers=color:blue%7C"
    marker_label ="label:A%7C"
    api_key = "&key=" + API_KEY 

    map_image_url = prefix + size + marker_color + marker_label + coords + api_key 

    rslt = {"map_image_url": map_image_url}
    return flask.jsonify(result=rslt)

#############


if __name__ == "__main__":
    # Standalone (not running under green unicorn or similar)
    app.run(host="0.0.0.0")
