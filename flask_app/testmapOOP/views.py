from . import testmapOOP_blueprint
from flask import Flask, jsonify, render_template, request, current_app
from .genetic_algorithm import TSPGeneticAlgorithm
from .mst_algorithm import mst_algorithm

# create a connection/route between URL/ and the function index() that returns a response
@testmapOOP_blueprint.route('/testmapOOP', methods=['GET'])
def testmap():
    return render_template('testmapOOP.html') 

# POST: sending of information to another location
# example: sending a letter in the mail

# GET: retrieving information 
# example: going to the post office to ask for your letter

@testmapOOP_blueprint.route('/algo', methods=['POST'])
def runAlgorithm():
    
    # POST request
    current_app.logger.debug('testmapOOP')
    received_message = request.get_json() # parse as json
    dist_matrix = received_message['distMatrix']
    num_dests = received_message['numDests']
    algorithm = received_message['algorithm']

    if algorithm == 'genetic':
        optimal_route = TSPGeneticAlgorithm.getBestDistanceRoute(num_dests,dist_matrix,10)
    else: 
        optimal_route = mst_algorithm.primMST(num_dests,dist_matrix)

    message = {'optimal_route': optimal_route, 'algorithm_used': algorithm}
    return jsonify(message)
