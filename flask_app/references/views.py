'''
File name: /references/views.py

Author: Sofi Vinas, Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file defines the views (URL routing) for the references blueprint.

Creation Date: 10/27/2021
Last Modified: 10/29/2021
'''
from . import references_blueprint
from flask import Flask, jsonify, render_template, request, current_app

# create a route between URL (/references) and the function references() that returns a response
@references_blueprint.route('/references', methods=['GET'])
def references():
    # render references.html when the user goes to mapculture.co/references
    return render_template('references.html')
