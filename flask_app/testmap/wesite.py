from flask import Flask, render_template, request, jsonify
import requests, os
from urllib.parse import urlparse, urljoin
from flask import Flask, request, render_template, redirect, url_for, flash, abort, session
from flask_login import (LoginManager, current_user, login_required,
                         login_user, logout_user, UserMixin,
                         confirm_login, fresh_login_required)
from flask_wtf import FlaskForm as Form
from wtforms import BooleanField, StringField, PasswordField, validators
from passlib.hash import sha256_crypt as pwd_context
import json

###
# Globals
###

def hash_password(password):
    return pwd_context.using(salt="somestring").encrypt(password)

class LoginForm(Form):
    username = StringField('Username', [
        validators.InputRequired(u"Please, type in the username!"),
        validators.Length(min=2, max=25,
                          message=u"The username has to be 2-25 characters!")])
    password = PasswordField('Password', [
        validators.InputRequired(u"Please, type in the password!"),
        validators.Length(min=8, max=25,
                          message=u"The username has to be 8-25 characters!")])
    remember = BooleanField('Remember me')


class RegistrationForm(Form):
    username = StringField('Username', [
        validators.InputRequired(u"Please, type in the username!"),
        validators.Length(min=2, max=25,
                          message=u"The username has to be 2-25 characters!")])
    password = PasswordField('New Password', [
        validators.InputRequired(u"Please, type in the password!"),
        validators.Length(min=8, max=25,
                          message=u"The username has to be 8-25 characters!")])
    confirm = PasswordField('Repeat Password', [
        validators.InputRequired(u"Please, retype in the password!"),
        validators.EqualTo('password', message='Passwords must match!')])


def is_safe_url(target):
    """
    :source: https://github.com/fengsp/flask-snippets/blob/master/security/redirect_back.py
    """
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and ref_url.netloc == test_url.netloc


class User(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.username = username
        self.token = "Unknown"

    def set_token(self, token):
        self.token = token
        return self



app = Flask(__name__)
app.secret_key = "just a random secret key that nobody knows"

app.config.from_object(__name__)

login_manager = LoginManager()

login_manager.session_protection = "strong"

login_manager.login_view = "login"
login_manager.login_message = u"Please log in to access this page."

login_manager.refresh_view = "login"
login_manager.needs_refresh_message = (
    u"To protect your account, please reauthenticate to access this page."
)
login_manager.needs_refresh_message_category = "info"

@login_manager.user_loader
def load_user(user_id):
    user = None
    if 'id' in session and 'username' in session and 'token' in session:
        id = session['id']
        if id == user_id:
            username = session['username']
            token = session['token']
            user = User(id, username).set_token(token)
    return user

login_manager.init_app(app)