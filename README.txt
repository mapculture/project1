## CIS 422 Project 1 - Traveling Salesperson Problem Web App

#### Running the web app:

1. Install docker
2. Obtain an API key of Google Maps Javascript API, Directions API, Distance Matrix API
3. Put your API key on line 8 of `/flask_app/map/templates/map.html`

4. Build a Docker image, create and run a Docker container using docker-compose:

- If you are on macOS or Linux: you can execute the `run.sh` script

- If you are on Windows: `docker-compose up -d` in Microsoft PowerShell

5. Visit `localhost:5000` in your web browser

#### Making changes:

Using docker-compose script will automatically push changes to the web app immediately after changes are made (without having to run any further commands or scripts).

    project1
    ├── docker-compose.yml
    ├── Dockerfile
    ├── flask_app
    │   ├── about
    │   │   ├── __init__.py
    │   │   ├── static
    │   │   │   ├── mapcultureanimated.gif
    │   │   │   ├── scenicbackground.mp4
    │   │   │   └── style.css
    │   │   ├── templates
    │   │   │   └── about.html
    │   │   └── views.py
    │   ├── auth
    │   │   ├── api_db.py
    │   │   ├── db.py
    │   │   ├── __init__.py
    │   │   ├── static
    │   │   │   ├── desert.jpg
    │   │   │   └── style.css
    │   │   ├── templates
    │   │   │   ├── index.html
    │   │   │   └── login.html
    │   │   └── views.py
    │   ├── config.py
    │   ├── home
    │   │   ├── __init__.py
    │   │   ├── static
    │   │   │   ├── index.js
    │   │   │   ├── sceniccool.mp4
    │   │   │   └── style.css
    │   │   ├── templates
    │   │   │   └── index.html
    │   │   └── views.py
    │   ├── __init__.py
    │   ├── map
    │   │   ├── brute_force_algorithm
    │   │   │   └── TSPBruteAlgorithm.py
    │   │   ├── genetic_algorithm
    │   │   │   ├── Gnome.py
    │   │   │   ├── Gnomes.py
    │   │   │   ├── __init__.py
    │   │   │   ├── README.txt
    │   │   │   └── TSPGeneticAlgorithm.py
    │   │   ├── __init__.py
    │   │   ├── mst_algorithm
    │   │   │   ├── adj_matrix.py
    │   │   │   ├── __init__.py
    │   │   │   ├── mst_algorithm.py
    │   │   │   └── README.txt
    │   │   ├── static
    │   │   │   ├── background.jpg
    │   │   │   ├── index.js
    │   │   │   └── stylemap.css
    │   │   ├── templates
    │   │   │   └── map.html
    │   │   └── views.py
    │   ├── references
    │   │   ├── __init__.py
    │   │   ├── static
    │   │   │   ├── frank-mckenna-OD9EOzfSOh0-unsplash.jpg
    │   │   │   └── style.css
    │   │   ├── templates
    │   │   │   └── references.html
    │   │   └── views.py
    │   ├── static
    │   │   ├── mapcultureicon.ico
    │   │   └── mapculturelogo.png
    │   └── templates
    │       ├── 404.html
    │       ├── 405.html
    │       └── 500.html
    ├── kill.sh
    ├── README.md
    ├── README.txt
    ├── requirements.txt
    └── run.sh

### Debugging the Flask server:

    docker logs -f project1-flaskwebservice-1    

### Resources:

Docker: https://docs.docker.com/get-started/

Flask: https://flask.palletsprojects.com/en/2.0.x/

Google Maps Javascript API: https://developers.google.com/maps/documentation/javascript/overview

### Credit:

Modified/retrofitted pieces of code from UOCIS322's Project 3: https://bitbucket.org/UOCIS322/proj3-jsa/src/master/
