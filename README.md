## CIS 422 Project 1 - Traveling Salesperson Problem Web App

#### Running the web app:

1. Install docker
2. Obtain an API key of Google Maps Javascript API
3. Put your API key on line 1 of `/flask_app/static/index.js`
4. Build a Docker image, create and run a Docker container with the `run.sh` script
5. `localhost:5000` in your web browser

#### Making changes:

In order to view the changes that you have made to any of the files belonging to the flask app you must:

1. Stop the running container
2. Remove the stopped container
3. Build a new Docker image using the updated source code
4. Create and run a new Docker container from the newly created image

You can use the `kill.sh` script to do this quickly.

NOTE: Eventually, it will be a good idea to create a docker-compose file that will automatically push changes to the web app immediately after changes are made (without having to run any commands or scripts).

### Resources:

Docker: https://docs.docker.com/get-started/

Flask: https://flask.palletsprojects.com/en/2.0.x/

Google Maps Javascript API: https://developers.google.com/maps/documentation/javascript/overview

### Credit:

Modified/retrofitted pieces of code from UOCIS322's Project 3: https://bitbucket.org/UOCIS322/proj3-jsa/src/master/
(I will better document what code was used from this project in each individual file soon - Kelemen)
