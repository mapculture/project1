### CIS 422 Project 1

Modified/retrofitted pieces of code from UOCIS322's Project 3: https://bitbucket.org/UOCIS322/proj3-jsa/src/master/

1. Install docker
2. Obtain an API key of Google Maps Javascript API
3. Put your API key on line 1 of `/flask_app/static/index.js`
4. `./run.sh`
5. `localhost:5000` in your web browser

Making changes:

In order to view the changes that you have made to any of the files belonging to the flask app you must:

1. Stop the running container
2. Remove the stopped container
3. Build and run a new container with the updated code.

You can use the `kill.sh` script to do this quickly.

Eventually, it will be a good idea to create a docker-compose file that will automatically do all of this for us when changes are made (without having to run any commands or scripts).

### Resources:

Docker: https://docs.docker.com/get-started/
Flask web framework: https://flask.palletsprojects.com/en/2.0.x/
Google Maps Javascript API: https://developers.google.com/maps/documentation/javascript/overview
