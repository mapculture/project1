'''
File name: /about/views.py

Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file defines the views (URL routing) for the about blueprint.

Creation Date: 10/27/2021
Last Modified: 10/27/2021
'''
from . import about_blueprint
from flask import Flask, jsonify, render_template, request, current_app

# create a route between a URL (/about) and the function about() that returns a response
@about_blueprint.route('/about', methods=['GET'])
def about():
    # render about.html when the user goes to mapculture.co/about
    return render_template('about.html') 
