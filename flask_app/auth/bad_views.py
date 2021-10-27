from . import testmapOOP_blueprint
from flask import Flask, jsonify, render_template, request, current_app
from .genetic_algorithm import TSPGeneticAlgorithm
from .mst_algorithm import mst_algorithm
import db # Database operations
from passlib.hash import sha256_crypt as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer \
                                  as Serializer, BadSignature, \
                                  SignatureExpired)

# create a connection/route between URL/ and the function index() that returns a response
@testmapOOP_blueprint.route('/testmapOOP', methods=['GET'])
def testmap():
    return render_template('testmapOOP.html') 

# POST: sending of information to another location
# example: sending a letter in the mail

# GET: retrieving information 
# example: going to the post office to ask for your letter

client = db.Mongodb(os.environ['MONGODB_HOSTNAME'])
client.connect()
client.set_data("brevetsdb")

parser = reqparse.RequestParser()
parser.add_argument('username', required=True, help="Need an username!")
parser.add_argument('password', required=True, help="Need a password!")

SECRET_KEY = "test1234@#$"

def hash_password(password):
    return pwd_context.using(salt="somestring").encrypt(password)

def check_password(password, hashVal):
    return pwd_context.verify(password, hashVal)

def generate_auth_token(id, expiration=60):
   s = Serializer(SECRET_KEY, expires_in=expiration)
   return s.dumps({'id': id})

def verify_auth_token(token):
    s = Serializer(SECRET_KEY)
    try:
        data = s.loads(token)
    except SignatureExpired:
        return None    
    except BadSignature:
        return None    
    return "Success"

class register(Resource):
    def post(self):
        client.set_collection("user")
        info = parser.parse_args()
        if not (2 <= len(info['username']) <= 25):
            return abort(400, "The username has to be 2-25 characters!")
        app.logger.debug(f"before: {info['password']}")
        info['password'] = hash_password(info['password'])
        app.logger.debug(f"after: {info['password']}")
        if len(client.f_find([], {'username': info['username']})) == 0:
            info['id'] = client.generate_id()
            client.insert(info)
            return "Registrarion is successful!", 201
        else:
            return abort(400, "This account has already been created")


class token(Resource):
    def get(self):
        client.set_collection("user")
        username = request.args.get("username", default="")
        password = request.args.get("password", default="")
        if username == "" or password == "":
            return abort(400, "Need both a username and a password")
        info = client.f_find(["id", "password"], {'username': username})
        if info:
            info = info[0]
            id = info["id"]
            auth = {"id": id, "duration": 60}
            hashed_ = info["password"]
            app.logger.debug(f"password: {password}, hashed: {hashed_}, verify: {check_password(password, hashed_)}")
            if check_password(password, hashed_):
                auth["token"] = generate_auth_token(id).decode("utf-8")
                return json.dumps(auth), 201
            return abort(400, "Incorrect password. Please try again!")
        else:
            return abort(400, "This username does not exist. PLease register first and try agian")

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
