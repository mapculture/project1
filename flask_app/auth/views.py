'''
File name: /auth/views.py

Author: Kelemen Szimonisz, Liam Dauphinee, Sofi Vinas
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file defines the views (URL routing) for the auth blueprint.

Creation Date: 10/24/2021
Last Modified: 10/28/2021
'''

from . import auth_blueprint
from flask import Flask, jsonify, render_template, request, current_app, redirect, url_for
from . import db

mongo = db.Mongodb()
mongo.connect()

# create a route between a URL (/login) and the function login() that returns a response
@auth_blueprint.route('/login', methods=['GET'])
def login():
    # render about.html when the user goes to mapculture.co/login
    return render_template('login.html')

@auth_blueprint.route('/sign_in', methods=['GET'])
def sign_in():
    return redirect(url_for("home_blueprint.index"))

