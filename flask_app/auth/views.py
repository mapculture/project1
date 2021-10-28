from . import auth_blueprint
from flask import Flask, jsonify, render_template, request, current_app
from . import db

mongo = db.Mongodb()
mongo.connect()

@auth_blueprint.route('/registration', methods=['GET'])
def register():
    return render_template('registration.html')

# create a connection/route between URL /login and the function login() that returns a response
@auth_blueprint.route('/login', methods=['GET'])
def login():
    return render_template('login.html') 

