from . import about_blueprint
from flask import Flask, jsonify, render_template, request, current_app

# create a connection/route between URL/ and the function index() that returns a response
@about_blueprint.route('/about', methods=['GET'])
def about():
    return render_template('about.html') 
