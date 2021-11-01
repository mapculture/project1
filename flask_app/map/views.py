from . import map_blueprint
from flask import Flask, jsonify, render_template, request, current_app
from .genetic_algorithm import TSPGeneticAlgorithm
from .mst_algorithm import mst_algorithm

# create a connection/route between URL/ and the function index() that returns a response
#@testmap_blueprint.route('/testmap', methods=['GET'])
@map_blueprint.route('/map', methods=['GET'])
def map():
    return render_template('map.html') 

# POST: sending of information to another location
# example: sending a letter in the mail

# GET: retrieving information 
# example: going to the post office to ask for your letter

@map_blueprint.route('/algo', methods=['POST'])
def runAlgorithm():
    
    # POST request
    current_app.logger.debug('test')
    received_message = request.get_json() # parse as json
    dist_matrix = received_message['distMatrix']
    num_dests = received_message['numDests']
    algorithm = received_message['algorithm']

    if algorithm == 'genetic':
        optimal_route = TSPGeneticAlgorithm.getBestDistanceRoute(num_dests,dist_matrix)
        algorithm_used = 'genetic'
    else: 
        optimal_route = mst_algorithm.primMST(num_dests,dist_matrix)
        algorithm_used = 'MST'

    message = {'optimal_route': optimal_route, 'algorithm_used': algorithm_used}
    return jsonify(message)
