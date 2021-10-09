## CIS 422 Project 1 - Traveling Salesperson Problem Web App

#### Running the web app:

1. Install docker
2. Obtain an API key of Google Maps Javascript API, Directions API, Distance Matrix API
3. Put your API key on line 8 of `/flask_app/templates/getmap.html`

4. Build a Docker image, create and run a Docker container using docker-compose:

- If you are on macOS or Linux: you can execute the `run.sh` script

- If you are on Windows: `docker-compose up -d` in Microsoft PowerShell

5. Visit `localhost:5000` in your web browser

#### Making changes:

Using docker-compose script will automatically push changes to the web app immediately after changes are made (without having to run any further commands or scripts).

### Resources:

Docker: https://docs.docker.com/get-started/

Flask: https://flask.palletsprojects.com/en/2.0.x/

Google Maps Javascript API: https://developers.google.com/maps/documentation/javascript/overview

### Credit:

Modified/retrofitted pieces of code from UOCIS322's Project 3: https://bitbucket.org/UOCIS322/proj3-jsa/src/master/
