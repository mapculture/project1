from . import auth_blueprint
from flask import render_template
from . import db

mongo = db.Mongodb()
mongo.connect()

@auth_blueprint.route('/register', methods=['GET'])
def register():
    return render_template('register.html') 

# create a connection/route between URL /login and the function login() that returns a response
@auth_blueprint.route('/login', methods=['GET'])
def login():
    return render_template('login.html') 

