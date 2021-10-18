from . import testmap_blueprint
from flask import Flask, jsonify, render_template, request
from .genetic_algorithm import TSPGeneticAlgorithm

# create a connection/route between URL/ and the function index() that returns a response
@testmap_blueprint.route('/testmap', methods=['GET'])
def testmap():
    return render_template('testmap.html') 

# POST: sending of information to another location
# example: sending a letter in the mail

# GET: retrieving information 
# example: going to the post office to ask for your letter

@testmap_blueprint.route('/test', methods=['GET', 'POST'])
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

