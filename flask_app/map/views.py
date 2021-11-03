'''
File name: /map/views.py

Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file defines the views (URL routing) for the map blueprint.
The algorithm POST requests from the front end of the webapp are handled here.

Creation Date: 10/12/2021
Last Modified: 11/01/2021
'''
from . import map_blueprint
from flask import Flask, jsonify, render_template, request, current_app
from .genetic_algorithm import TSPGeneticAlgorithm
from .mst_algorithm import mst_algorithm

# create a route between the URL (/map) and the function map() that returns a response
@map_blueprint.route('/map', methods=['GET'])
def map():
    # render map.html when the user goes to mapculture.co/map
    return render_template('map.html') 

# POST: sending of information to another location
# example: sending a letter in the mail

# GET: retrieving information 
# example: going to the post office to ask for your letter

# handle POST requests that are sent to the URL /algo
# Receive an origins-destinations matrix, algorithm type, and number of destinations
# Run the requested TSP algorithm, calculate the optimal route
# Send a JSON response containing the optimal route 
@map_blueprint.route('/algo', methods=['POST'])
def runAlgorithm():
    # POST request
    # parse the POST request as JSON
    received_message = request.get_json() # parse as json
    # the distance/duration matrix
    dist_matrix = received_message['distMatrix']
    # the number of destinations on the route
    num_dests = received_message['numDests']
    # the requested algorithm type
    # two types: 'genetic' and 'MST'
    algorithm = received_message['algorithm']

    # if the genetic algorithm is requested 
    if algorithm == 'genetic':
        # obtain the optimal route using the genetic algorithm from the TSPGeneticAlgorithm package
        # the optimal route is a list of the destination indexes sorted in optimal order
        optimal_route = TSPGeneticAlgorithm.getBestDistanceRoute(num_dests,dist_matrix)
        # algorithm used sanity check, for debugging purposes
        algorithm_used = 'genetic'

    # MST algorithm requested
    else: 
        # obtain the optimal route using the MST algorithm from the mst_algorithm package
        # the optimal route is a list of the destination indexes sorted in optimal order
        optimal_route = mst_algorithm.primMST(num_dests,dist_matrix)
        # algorithm used sanity check, for debugging purposes
        algorithm_used = 'MST'

    # respond with a message containing the optimal route order, the algorithm used sanity checker
    message = {'optimal_route': optimal_route, 'algorithm_used': algorithm_used}
    # jsonify the message
    return jsonify(message)
