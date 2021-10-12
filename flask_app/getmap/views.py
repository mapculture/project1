from . import getmap_blueprint
from flask import render_template
from .genetic_algorithm import TSPGeneticAlgorithm

# create a connection/route between URL/ and the function index() that returns a response
@getmap_blueprint.route('/', methods=['GET'])
def getmap():
    # load the getmap.html at the root of the website
    return render_template('getmap.html') 
