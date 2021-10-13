## CIS 422 Project 1 - Traveling Salesperson Problem Web App

#### Running the web app:

1. Install docker
2. Obtain an API key of Google Maps Javascript API, Directions API, Distance Matrix API
3. Put your API key on line 8 of `/flask_app/getmap/templates/getmap.html`

4. Build a Docker image, create and run a Docker container using docker-compose:

- If you are on macOS or Linux: you can execute the `run.sh` script

- If you are on Windows: `docker-compose up -d` in Microsoft PowerShell

5. Visit `localhost:5000` in your web browser

#### Making changes:

Using docker-compose script will automatically push changes to the web app immediately after changes are made (without having to run any further commands or scripts).

    project1
    ├── coordinates.txt
    ├── docker-compose.yml
    ├── Dockerfile
    ├── documentation
    │   ├── buildingplan.md
    │   └── project1_prompt.pdf
    ├── flask_app
    │   ├── config.py
    │   ├── getmap
    │   │   ├── genetic_algorithm
    │   │   │   ├── Gnome.py
    │   │   │   ├── Gnomes.py
    │   │   │   ├── __init__.py
    │   │   │   └── TSPGeneticAlgorithm.py
    │   │   ├── __init__.py
    │   │   ├── static
    │   │   │   ├── index.js
    │   │   │   └── style.css
    │   │   ├── templates
    │   │   │   └── getmap.html
    │   │   └── views.py
    │   ├── home
    │   │   ├── __init__.py
    │   │   ├── static
    │   │   ├── templates
    │   │   │   └── home.html
    │   │   └── views.py
    │   └── __init__.py
    ├── kill.sh
    ├── README.md
    ├── requirements.txt
    └── run.sh

### Debugging the Flask server:

    docker logs -t project1-flaskwebservice
    
### Resources:

Docker: https://docs.docker.com/get-started/

Flask: https://flask.palletsprojects.com/en/2.0.x/

Google Maps Javascript API: https://developers.google.com/maps/documentation/javascript/overview

### Credit:

Modified/retrofitted pieces of code from UOCIS322's Project 3: https://bitbucket.org/UOCIS322/proj3-jsa/src/master/
