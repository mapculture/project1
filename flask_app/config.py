"""
File name: config.py

Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

Flask configuration.

This python file is a very basic configuration file for the Flask app.
"""

# Enable debug mode:
#   - interactive debugger for unhandled exceptions
#   - the server is reloaded when code changes (very helpful!!)
DEBUG = True

# Define the secret key
# Used for securely signing sessions cookies 
# (Not really utilized with our app, as we have not implemented cookies) 
# Should not be made public! (And should really be a much longer, random string)
SECRET_KEY = '123maps456'

