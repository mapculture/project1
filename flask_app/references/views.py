from . import about_blueprint
from flask import Flask, jsonify, render_template, request, current_app

# create a connection/route between URL/ and the function index() that returns a response
@references_blueprint.route('/references', methods=['GET'])
def references():
    return render_template('references.html')
