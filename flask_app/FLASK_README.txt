
The flask_app folder contains the main Flask application object.


-------------- THE MAIN FLASK APP ----------------------------------
The Flask application object is defined in:

    - flask_app/__init.__py

    All Flask Blueprints are registered in this file.
    All HTTP error handling is configured in this file.

The Flask application is configured with the file:

    - flask_app/config.py

The global templates and static files for the Flask app are located inside of:

    - flask_app/templates
    - flask_app/static

    The files in these folders are exposed to all components that make-up the app 
    (website icon, organization logo image, error pages).

-------------- FLASK BLUEPRINTS (Components) ----------------------------------
The following sub-folders represent the Flask Blueprint objects that extend the functionality of the main Flask application object:

    - flask_app/about/
    - flask_app/auth/
    - flask_app/home/
    - flask_app/map/
    - flask_app/references/ 

Each Flask Blueprint is defined in its own __init__.py file:

    - flask_app/about/__init__.py
    - flask_app/auth/__init__.py
    - flask_app/home/__init__.py
    - flask_app/map/__init__.py
    - flask_app/references/__init__.py

    These files also tells Python that these subfolders are Python packages.
    This allows the main Flask app to import each Blueprint from its subdirectory.

Each Flask Blueprint contains it's own templates and static folders that are exposed only to that blueprint

    - flask_app/about/templates/
    - flask_app/about/static/

    - flask_app/auth/templates/
    - flask_app/auth/static/

    - flask_app/home/templates/
    - flask_app/home/static/
        
    - flask_app/map/templates/
    - flask_app/map/static/

    - flask_app/references/templates/
    - flask_app/references/static/

Each Flask Blueprint may render templates and respond to HTTP method requests (GET, POST, etc.) via it's views.py file:

    - flask_app/about/views.py
    - flask_app/auth/views.py
    - flask_app/home/views.py
    - flask_app/map/views.py    
    - flask_app/references/views.py

    For example: the flask_app/map/views.py file is where the TSP algorithm POST request is received from the frontend, 
                 processed, and responded to with a JSON message including the optimal route.

---------------- FLASK APP FILE TREE -------------------------------------------------

Here is a file tree of the flask_app directory and its subdirectories:

flask_app
├── about
│   ├── __init__.py
│   ├── static
│   │   ├── mapcultureanimated.gif
│   │   ├── scenicbackground.mp4
│   │   └── style.css
│   ├── templates
│   │   └── about.html
│   └── views.py
├── auth
│   ├── api_db.py
│   ├── db.py
│   ├── __init__.py
│   ├── static
│   │   ├── desert.jpg
│   │   └── style.css
│   ├── templates
│   │   ├── index.html
│   │   └── login.html
│   └── views.py
├── config.py
├── home
│   ├── __init__.py
│   ├── static
│   │   ├── index.js
│   │   ├── sceniccool.mp4
│   │   └── style.css
│   ├── templates
│   │   └── index.html
│   └── views.py
├── __init__.py
├── map
│   ├── brute_force_algorithm
│   │   └── TSPBruteAlgorithm.py
│   ├── genetic_algorithm
│   │   ├── Gnome.py
│   │   ├── Gnomes.py
│   │   ├── __init__.py
│   │   ├── README.txt
│   │   └── TSPGeneticAlgorithm.py
│   ├── __init__.py
│   ├── mst_algorithm
│   │   ├── adj_matrix.py
│   │   ├── __init__.py
│   │   ├── mst_algorithm.py
│   │   └── README.txt
│   ├── static
│   │   ├── background.jpg
│   │   ├── index.js
│   │   └── stylemap.css
│   ├── templates
│   │   └── map.html
│   └── views.py
├── README.txt
├── references
│   ├── __init__.py
│   ├── static
│   │   ├── frank-mckenna-OD9EOzfSOh0-unsplash.jpg
│   │   └── style.css
│   ├── templates
│   │   └── references.html
│   └── views.py
├── static
│   ├── mapcultureicon.ico
│   └── mapculturelogo.png
└── templates
    ├── 404.html
    ├── 405.html
    └── 500.html
