/*****************************************************************************************************************************************************************************
File Name: index.js
 
Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This Javascript file is used by the getmap.html template and enables the page to:
    1. Append the number of inputs to the destination entry form when the 'Add destination' button is clicked.
    2. Handle the submit button for the destination entry form
    3. Use the Google Maps Javascript API to:
        - Initialize an interactive Google map
        - Request and receive coordinates for user inputted addresses or places (Places API)
        - Request and receive a list of distances and durations to and from each location (Distance Matrix API), then parse that information into 2D matrices 
        - Draw an optimal route (once calculated -- see part 4)
    4. Request and receive an optimal route from our backend Flask server, providing a distance or duration matrix as input
        - Draw this optimal route onto the map 

Creation Date: 10/03/2021
Last Modified: 10/17/2021

TODO: - Improper input handling... no input, wrong coordinate syntax
*****************************************************************************************************************************************************************************/

class Route {
    constructor(startPoint,waypoints,endPoint,directionsService,directionsRenderer){
        this.startPoint = startPoint;
        this.waypoints = waypoints;
        this.endPoint = endPoint;
        this.directionsService = directionsService;
        this.directionsRenderer = directionsRenderer;
        this.optimalWaypoints;
    }   

    async getMatrix(distanceMatrixService){
        // create an n x n distance matrix
        // calculate the distance and time between the origin to each destination
        // calculate the distance and time between each destination to each other destination
        // calculate the distance and time between each destination to the origin
        // note: this also counts distance/time from a location to itself (i.e. origin to origin)
        const response = await distanceMatrixService.getDistanceMatrix({
            // origins and destinations are the same locations in the same order
            // slice the last element of the input list of destinations (this element represents the TSP's return to the origin location)
            // (we do not want our matrix to have duplicate column headers are duplicate row headers)
            origins: [this.startPoint].concat(this.waypoints),
            destinations: [this.startPoint].concat(this.waypoints),
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
        });
        console.log(response);

        // instantiate distance matrix, duration matrix
        // 1D arrays, length corresponds to number of rows in the matrix produced by the response
        var distanceMatrix = new Array(response.rows.length);
        var durationMatrix = new Array(response.rows.length);

        // For each row in the matrix received from Google
        for (var i = 0; i < response.rows.length; i++) {

            // The rows' elements correspond to the pairing of the origins (rows) with the destination (columns) of the distance or duration matrix
            var rowElements = response.rows[i].elements;

            // instantiate a new array at the current index of both the distanceMatrix and durationMatrix array (creating 2D arrays)
            // the length corresponds to the number of elements in the current row
            distanceMatrix[i] = new Array(rowElements.length);
            durationMatrix[i] = new Array(rowElements.length);
           
            // for each element in the current row of Google's matrix response
            for (var j = 0; j < rowElements.length; j++) {
                // Element at row i, column j of Google's matrix response 
                var element = rowElements[j];

                // the distance value in kilometers 
                var distance = element.distance.value;

                // the duration value in minutes
                var duration = element.duration.value;

                // populate the distance matrix with the row element's distance value
                distanceMatrix[i][j] = distance;

                // populate the duration matrix with the row element's duration value
                durationMatrix[i][j] = duration;

                console.log("from:",response.originAddresses[i],"\n","to:",response.destinationAddresses[j],"\n","distance:",distance,"\n","duration:",duration);
            }
        }
        console.log("Distance Matrix:", distanceMatrix,"\n","Duration matrix:",durationMatrix);
        return distanceMatrix;
    }
    async getOptimalRoute (algorithm,matrix){
        // send HTTP POST request to the URL /optimalroute
        // header specifies to the receiving Flask server that we are sending a json
        // body of request is a JSON with the number of destinations on the route and distance matrix
        console.log("Algorithm requested:",algorithm);
        var destinations = [this.startPoint].concat(this.waypoints,[this.endPoint]);
        const flask_response = await fetch('/algo', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({'numDests': destinations.length-1, 'distMatrix': matrix, 'algorithm': algorithm}),
        });

        // extract the JSON object from the response (the data sent back from the Flask server)
        // Note: response.json() returns a Promise, therefore await is necessary
        const data = await flask_response.json();
        console.log('POST response:', data);

        // an array that represents optimal destination order
        var optimalRouteOrder = data['optimal_route'];
        var algorithmConfirmation = data['algorithm_used'];
        // sort the destinations in order of the optimalRoute, draw the route on the map
        var optimalRoute = optimalRouteOrder.map(i => destinations[i]);
        return optimalRoute;
    }
    drawRoute() {
        var waypts = [];
        for(i = 0; i < this.waypoints.length; i++){
            // a Google DirectionsWaypoint requires two fields: location and stopover 
            waypts.push({
                location: this.waypoints[i],
                // a boolean that indicates that the waypoint is a stop on the route
                stopover: true,
            });
        }

        // create a request for round-trip directions (from origin to origin) and visit all waypoints along the way
        // waypoints are followed in order of waypts list
        // set travel mode to DRIVING (route will be drawn accordingly)
        var request = {
            origin: this.startPoint,
            destination: this.endPoint,
            waypoints: waypts,
            travelMode: 'DRIVING'
        };

        var renderer = this.directionsRenderer;

        // send the request to the DirectionsService
        this.directionsService.route(request, function(result, status){
            console.log(result);
            // if the response status is OK, then draw the resulting route on the map using the DirectionsRenderer's setDirections method
            if (status == 'OK') {
                //this.directionsRenderer.setDirections(result);
                renderer.setDirections(result);
            }
        });
    }


}

class Place {
    constructor(userInput,placesService){
        this.userInput = userInput;
        this.placesService = placesService;
    }
    getCoordinate() {
    //function getPlace(address){
        // create a FindPlaceFromQueryRequest
        // query: the user inputted location string
        // fields: the fields we would like the service to respond with, in this case: the name and coordinates of the location
        var request = {
            query: this.userInput,
            fields: ['name','geometry'],
        }; 

        // return a Promise object that sends a findPlaceFromQuery request using the Places Service
        // the promise object results to the latitude and longitude of the inputted address (if the request is successful)
        return new Promise((resolve, reject) => {
            this.placesService.findPlaceFromQuery(
                request,
                (response, status) => {
                    if(status === 'OK'){
                        // the response is a list of places in an order determined by what Google deems as most likely to be the correct location (given the inputted string)
                        // in this case, the first place in the list is chosen, and its coordinates are captured in a dictionary
                        // the Promise object is resolved with this value
                        resolve({
                            lat: response[0].geometry.location.lat(),
                            lng: response[0].geometry.location.lng(),
                        });
                    }
                    else {
                        reject(response);
                    }
                }
            )
        });
    }
}

function initMap(){
   
    // Instantiate a Google Maps Javascript API interactive map and assign it to the global variable, set initial properties for the Map object
    // An HTML div is required to create the map object. <div> element with the ID 'map' from getmap.html will hold the map.
    map = new google.maps.Map(document.getElementById('map'), {
            // set zoom level
            // Google Maps API approximate level of detail per zoom level:
            // 1: World, 5: Landmass/continent, 10: City, 15: Streets, 20: Buildings
            zoom: 12,
    });
   

    // Specify that directions should be rendered on the map object
    //directionsRenderer.setMap(map);
    return map;
}


/****************************************************************************************************************************************************************************
FUNCTION: addMarker

This function uses the Google Maps Javascript API to instantiate a Marker object and initialize it with a set of coordinates and a label.
The marker object is added to the global list: markers.
Markers are labeled in A-Z in order of their priority in the route.
****************************************************************************************************************************************************************************/
function addMarker(coords,index){
    // a list of marker label characters (A-Z)
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // create a new marker, to be placed on the global map variable
    const marker = new google.maps.Marker({
        position: coords,
        label: labels[index],
        map: map,
    });
}

/****************************************************************************************************************************************************************************
FUNCTION: setMapOnAll

This function draws all markers from the markers list onto the map.

This code was taken from a Google Maps API Documentation Example
Source: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
****************************************************************************************************************************************************************************/
function setMapOnAll(map,markers){
    for (let i=0; i<markers.length; i++){
        markers[i].setMap(map);
    }
}

/****************************************************************************************************************************************************************************
FUNCTION: getMatrix

This function uses the getDistanceMatrix method of the Google Maps Distance Matrix Service to request a distance matrix and duration matrix and then parse/return its response.
A request is formed with:
    - a list of origin coordinates and destination coordinates
        - In order to obtain a matrix for all possible combinations: both lists contain the same set of coordinates
    - the travel mode: DRIVING
    - the unit system: METRIC

If the response status is OK, then the distance and duration matrix rows are parsed into their respective Arrays.

Some code taken from: https://developers.google.com/maps/documentation/javascript/distancematrix#distance_matrix_parsing_the_results
****************************************************************************************************************************************************************************/

/****************************************************************************************************************************************************************************
Function getOptimalRoute

This function sends a POST HTTP request to the '/optimalroute' URL of the Flask server and receives a response containing the optimal route produced by a TSP algorithm
The request consists of the number of inputted destinations and the distance or destination matrix as a JSON.

The Flask server responds with a JSON that contains the optimal order in which to travel to each destination (determined by TSP algorithm).
The async/await keywords allow the the function to operate asynchronously. The function will pause until the request completes.
****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************
FUNCTION: drawRoute

This function uses the Google Directions Service's route method to obtain a street-by-street path from a list of destinations.
The DirectionsRenderer object is used to draw the route on the map.

The function takes a list of destinations as input, where the first and last destinations are origins. The route will be formed by order of the list.
****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************
FUNCTION: drawMap

This is the main function that draws an interactive map with an optimal route between an origin and a set of destinations. 
This function takes in a list of user inputted location strings, where the first and last locations are the same. (Round trip).
It initializes the Google Maps Javascript API map, then calls the helper function getPlace to convert the user inputted destinations into coordinates.
A marker is created at each set of coordinates (except for the final location, to not overlap with the starting location's marker -- as they are the same).
The distance and duration matrices are obtained by calling getMatrix, a call is then made to getOptimalRoute with that function as input.
Finally, the route is drawn on the map using drawRoute.

Note: The origin is both a starting location and an ending location on the route (the first and last index of the destinations list is the origin location). 
****************************************************************************************************************************************************************************/
async function drawMap(startPoint,waypoints,endPoint,algorithm){
    //var map = initMap();
    var map = new google.maps.Map(document.getElementById('map'), {
            // set zoom level
            // Google Maps API approximate level of detail per zoom level:
            // 1: World, 5: Landmass/continent, 10: City, 15: Streets, 20: Buildings
            zoom: 12,
    });

    var startCoords = await startPoint.getCoordinate();
    var endCoords = await endPoint.getCoordinate();

    map.setCenter(startCoords);

    var waypointsCoords = [];
    for (i = 0; i < waypoints.length; i++){
        waypointsCoords.push(await waypoints[i].getCoordinate());
    }
    // Assign the Distance Matrix and Directions service to their respective global variables
    var directionsService = new google.maps.DirectionsService();
    
    // Assign the DirectionsRenderer to its respective global variable, set properties for the DirectionsRenderer object
    var directionsRenderer = new google.maps.DirectionsRenderer({
        // stop the DirectionsRenderer from producing its own markers
        //suppressMarkers: false
        suppressMarkers: true
    });
    var route = new Route(startCoords,waypointsCoords,endCoords,directionsService,directionsRenderer);

    // obtain the distance matrix
    var distanceMatrixService = new google.maps.DistanceMatrixService();
    var distanceMatrix = await route.getMatrix(distanceMatrixService);

    // obtain the optimal route from the origin to the waypoints and back to the origin, optimized for reducing distance traveled
    // this returns the order in which the destinations in the destCoords list should be traveled (by indices)
    var optimalRoute = await route.getOptimalRoute(algorithm,distanceMatrix);
    console.log("Optimal route:",optimalRoute);
    route.waypoints = optimalRoute.slice(1,-1);

    // create markers for all but the endPoint 
    // (this is to avoid overlapping the origin location with two markers)
    var markers = [];
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < optimalRoute.length-1; i++) {
        var coords = optimalRoute[i];
        const marker = new google.maps.Marker({
            position: coords,
            label: labels[i],
            map: map,
        });
        markers.push(marker);
    }
    // draw the Markers on the map
    setMapOnAll(map,markers);
    route.drawRoute();
    route.directionsRenderer.setMap(map);
}
    
/****************************************************************************************************************************************************************************
1234
EVENT LISTENERS

These are event listeners that attach to a specific element in the HTML template (or DOM object) and call a function when triggered.

****************************************************************************************************************************************************************************/
// Wait for DOM to load before manipulating elements
document.addEventListener("DOMContentLoaded", function() {
    // If 'submit' button is clicked:
    // Then calculate distance matrix, send coordinates and distances to backend
    document.getElementById('submit1').addEventListener('click', (e) => {
        // prevent form submission from reloading the page
        e.preventDefault();
        console.log("test");
        
        // value of the user's input to the 'Origin:' text input field
        var placesService = new google.maps.places.PlacesService(document.createElement('places'));
        var origin = new Place(document.getElementById('origin').value,placesService);
        var startPoint = origin;
        var endPoint = origin;

        // a list of elements that belong to the class 'dest-entry'
        // a.k.a. all text input elements with the label 'Destination:'
        var destEntries = document.querySelectorAll('.dest-entry');

        // a list of user inputted destinations
        var waypoints = [];

        // push the values of all text input elements that belong to the class 'dest-entry' to the destinations list
        for(let i = 0; i < destEntries.length; i++){
            var waypoint = new Place(destEntries[i].value,placesService);
            waypoints.push(waypoint);
        } 
        console.log(waypoints[0].userInput);
        // draw a Google Maps Javascript API interactive map that displays an optimal route between the inputted destinations
        // (starting at destinations[0] and ending at destinations[-1]
        drawMap(startPoint,waypoints,endPoint,'genetic');
    });
   
    // if 'add destination' button is clicked:
    // Then create a text entry input field and append it to the form 
    document.getElementById('add-dest-bttn').addEventListener('click', (e) => {
        // the number of destination entry boxes that currently exist in the HTML
        var numDests = document.querySelectorAll('.dest-entry').length + 1;
        // create a string to be used in as an HTML id attribute, represents what 'dest' number the element is
        var destId = "dest" + String(numDests);

        // create a new HTML <label> element and set the 'for' attribute to the destId, also set the 'text' attribute to label what destination it is
        var newDestLabel = document.createElement("label");
        newDestLabel.htmlFor = destId;
        newDestLabel.textContent = "Destination " + numDests + ":";

        // create a new HTML <input> element and set the 'id' attribute to destId, 'class' attribute to 'dest-entry', 'name' attribute to destId
        var newDestInput = document.createElement("input");
        newDestInput.id = destId;
        newDestInput.className = "dest-entry";
        newDestInput.name = destId;

        // the element on the HTML page with the id 'dest-form' 
        var destinationEntryForm = document.getElementById('dest-form');

        // append the newly created <label> and <input> elements to the form
        destinationEntryForm.append(newDestLabel,newDestInput);
    });
});
