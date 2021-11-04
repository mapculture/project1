'''
File name: /about/views.py

Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file defines the views (URL routing) for the about blueprint.

Creation Date: 10/27/2021
Last Modified: 10/27/2021
'''
from . import home_blueprint
from flask import Flask, jsonify, render_template, request, current_app

# create a route between the URL (/) and the function index() that returns a response
# the root of the website
@home_blueprint.route('/', methods=['GET'])
def index():
    # render index.html when the user goes to mapculture.co
    return render_template('index.html')
