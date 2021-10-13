from . import getmap_blueprint
from flask import Flask, jsonify, render_template, request
from .genetic_algorithm import TSPGeneticAlgorithm

# create a connection/route between URL/ and the function index() that returns a response
@getmap_blueprint.route('/', methods=['GET'])
def getmap():
    # load the getmap.html at the root of the website
    return render_template('getmap.html') 

# POST: sending of information to another location
# example: sending a letter in the mail

# GET: retrieving information 
# example: going to the post office to ask for your letter

@getmap_blueprint.route('/test', methods=['GET', 'POST'])
def runAlgorithm():
    
    # POST request
    if request.method == 'POST':
        received_message = request.get_json(force=True) # parse as json
        dist_matrix = received_message['distMatrix']
        num_dests = received_message['numDests']
        #message = {'rightbackatya': distMatrix}
        optimal_route = TSPGeneticAlgorithm.getBestDistanceRoute(num_dests,dist_matrix,10)
        message = {'optimal_route': optimal_route}
        #return 'OK', 200
        return jsonify(message)

    # GET request
    else:
        message = {'greeting':'Hello from Flask!'}
        return jsonify(message)

