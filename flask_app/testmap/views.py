from . import testmap_blueprint
from flask import Flask, jsonify, render_template, request, current_app
from .genetic_algorithm import TSPGeneticAlgorithm
from .mst_algorithm import mst_algorithm

# create a connection/route between URL/ and the function index() that returns a response
@testmap_blueprint.route('/testmap', methods=['GET'])
def testmap():
    return render_template('testmap.html') 

# POST: sending of information to another location
# example: sending a letter in the mail

# GET: retrieving information 
# example: going to the post office to ask for your letter

@testmap_blueprint.route('/algo', methods=['GET', 'POST'])
def runAlgorithm():
    
    # POST request
    current_app.logger.debug('test')
    if request.method == 'POST':
        received_message = request.get_json(force=True) # parse as json
        dist_matrix = received_message['distMatrix']
        num_dests = received_message['numDests']
        algorithm = received_message['algorithm']

        if algorithm == 'genetic':
            optimal_route = TSPGeneticAlgorithm.getBestDistanceRoute(num_dests,dist_matrix,10)
        else: 
            optimal_route = mst_algorithm.primMST(num_dests,dist_matrix)

        message = {'optimal_route': optimal_route, 'algorithm_used': algorithm}
        #return 'OK', 200
        return jsonify(message)

    # GET request
    else:
        message = {'greeting':'Hello from Flask!'}
        return jsonify(message)

