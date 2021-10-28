from . import home_blueprint
from flask import Flask, jsonify, render_template, request, current_app

# create a connection/route between URL/ and the function index() that returns a response
@home_blueprint.route('/', methods=['GET'])
def index():
    return render_template('index.html') 
