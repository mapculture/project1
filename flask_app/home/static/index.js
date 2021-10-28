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
*****************************************************************************************************************************************************************************\

/* Declare global index.js variables: */
let map;                   /* The Google Maps Javascript API map instance */
let directionsService;     /* Communicates with the Google Maps Javascript API Directions Service. Enables the app to send an ordered set of destinations and receive a path. */
let directionsRenderer;    /* Handles the results produced by the directionsService. Enables the app to draw a path on the map. */
let distanceMatrixService; /* Communicates with the Google Maps Javascript API Distance Matrix Service. Computes travel distance for a set of destinations. */
let placesService;         /* This object communicates with the Google Maps Javascript API Places Library. Enables the app to obtain a coordinate given an address or place name */
let markers = [];          /* Set of map markers, to be drawn on map */

/*****************************************************************************************************************************************************************************
FUNCTION: initMap

This function instantiates and initializes the interactive map that is provided by the Google Maps Javascript API.
All services or libraries used by the Google Maps Javascript API map are initalized here as well (Places, DistanceMatrix, Directions).

****************************************************************************************************************************************************************************/
function initMap(){
    // Assign the Distance Matrix and Directions service to their respective global variables
    distanceMatrixService = new google.maps.DistanceMatrixService();
    directionsService = new google.maps.DirectionsService();
    
    // Assign the DirectionsRenderer to its respective global variable, set properties for the DirectionsRenderer object
    directionsRenderer = new google.maps.DirectionsRenderer({
        // stop the DirectionsRenderer from producing its own markers
        suppressMarkers: true
        //suppressMarkers: false
    });
   
    // Instantiate a Google Maps Javascript API interactive map and assign it to the global variable, set initial properties for the Map object
    // An HTML div is required to create the map object. <div> element with the ID 'map' from getmap.html will hold the map.
    map = new google.maps.Map(document.getElementById('map'), {
            // set zoom level
            // Google Maps API approximate level of detail per zoom level:
            // 1: World, 5: Landmass/continent, 10: City, 15: Streets, 20: Buildings
            zoom: 12,
    });
   
    // Instantiate a Places Service and assign it to the respective global variable. Provide the map as input (so attributions can be rendered).
    placesService = new google.maps.places.PlacesService(map);

    // Specify that directions should be rendered on the map object
    directionsRenderer.setMap(map);
}

/*****************************************************************************************************************************************************************************
FUNCTION: getPlace

This function sends a user inputted address or place string inside of a FindPlaceFromQueryRequest to the Google Places Service using the findPlaceFromQuery method.

A Promise object is returned that will resolve when the response from Google's servers is complete.

If the response status is OK, then the state of the promise is fulfilled, and the promise results to a JSON containing the latitude and longitude values of the inputted address.
Else the state of the promise object is changed to 'rejected' and the result is the entire response with a negative HTTP status.
NOTE: The methods of all Google Maps Javascript API services, besides the Places Service, return Promises.
      Source: https://developers.google.com/maps/documentation/javascript/promises
    
      In order to maintain a consistent design for how this code handles asynchronous function calls, I chose to wrap this function's response in a Promise object.
      This stackoverflow answer helped me understand this process: https://stackoverflow.com/a/47893027

****************************************************************************************************************************************************************************/
function getPlace(address){

    // create a FindPlaceFromQueryRequest
    // query: the user inputted location string
    // fields: the fields we would like the service to respond with, in this case: the name and coordinates of the location
    var request = {
        query: address,
        fields: ['name','geometry'],
    }; 

    // return a Promise object that sends a findPlaceFromQuery request using the Places Service
    // the promise object results to the latitude and longitude of the inputted address (if the request is successful)
    return new Promise((resolve, reject) => {
        placesService.findPlaceFromQuery(
            request,
            (response, status) => {
                console.log(status);
                console.log(response);
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
                    reject(status);
                }
            }
        )
    });
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
    // append the new Marker to the global markers list
    markers.push(marker);
}

/****************************************************************************************************************************************************************************
FUNCTION: setMapOnAll

This function draws all markers from the markers list onto the map.

This code was taken from a Google Maps API Documentation Example
Source: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
****************************************************************************************************************************************************************************/
function setMapOnAll(map){
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
async function getMatrix(dests){
    var origin = dests[0];
    // create an n x n distance matrix
    // calculate the distance and time between the origin to each destination
    // calculate the distance and time between each destination to each other destination
    // calculate the distance and time between each destination to the origin
    // note: this also counts distance/time from a location to itself (i.e. origin to origin)
    const response = await distanceMatrixService.getDistanceMatrix({
        // origins and destinations are the same locations in the same order
        // slice the last element of the input list of destinations (this element represents the TSP's return to the origin location)
        // (we do not want our matrix to have duplicate column headers are duplicate row headers)
        origins: dests.slice(0,-1),
        destinations: dests.slice(0,-1),
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
    });
    console.log(response);

    // instantiate distance matrix, duration matrix
    // 1D arrays, length corresponds to number of rows in the matrix produced by the response
    var distanceMatrix = new Array(response.rows.length);
    var durationMatrix = new Array(response.rows.length);

    // For each row in the matrix received from Google
    var valid = true;
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
            if(element.distance == undefined || element.duration == undefined){
                valid = false;
            }
            else{
                var distance = element.distance.value;
                var duration = element.duration.value;
            }
            // populate the distance matrix with the row element's distance value
            distanceMatrix[i][j] = distance;

            // populate the duration matrix with the row element's duration value
            durationMatrix[i][j] = duration;

            console.log("from:",response.originAddresses[i],"\n","to:",response.destinationAddresses[j],"\n","distance:",distance,"\n","duration:",duration);
        }
    }
    console.log("Distance Matrix:", distanceMatrix,"\n","Duration matrix:",durationMatrix);
    return {'valid':valid,'distanceMatrix': distanceMatrix,'durationMatrix': durationMatrix,};
}

/****************************************************************************************************************************************************************************
Function getOptimalRoute

This function sends a POST HTTP request to the '/optimalroute' URL of the Flask server and receives a response containing the optimal route produced by a TSP algorithm
The request consists of the number of inputted destinations and the distance or destination matrix as a JSON.

The Flask server responds with a JSON that contains the optimal order in which to travel to each destination (determined by TSP algorithm).
The async/await keywords allow the the function to operate asynchronously. The function will pause until the request completes.
****************************************************************************************************************************************************************************/
async function getOptimalRoute (algorithm, matrix, destinations){
    // send HTTP POST request to the URL /optimalroute
    // header specifies to the receiving Flask server that we are sending a json
    // body of request is a JSON with the number of destinations on the route and distance matrix
    console.log("Algorithm requested:",algorithm);
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
    var optimal_route = data['optimal_route'];
    var algorithmConfirmation = data['algorithm_used'];
    return optimal_route;
}

/****************************************************************************************************************************************************************************
FUNCTION: drawRoute

This function uses the Google Directions Service's route method to obtain a street-by-street path from a list of destinations.
The DirectionsRenderer object is used to draw the route on the map.

The function takes a list of destinations as input, where the first and last destinations are origins. The route will be formed by order of the list.
****************************************************************************************************************************************************************************/
function drawRoute(dests) {
    // the origin is the first location in the dests list
    // the origin is the starting location and ending location of our route
    var origin = dests[0];

    // remove the origin location from the list of destinations (the starting location and the ending location)
    dests = dests.slice(1,-1);

    // a list to hold the waypoint locations: the locations on the route in between the starting location and ending location
    var waypts = [];

    // create a waypoint for each destination in the list
    for(i = 0; i < dests.length; i++){
        // a Google DirectionsWaypoint requires two fields: location and stopover 
        waypts.push({
            location: dests[i],
            // a boolean that indicates that the waypoint is a stop on the route
            stopover: true,
        });
    }

    // create a request for round-trip directions (from origin to origin) and visit all waypoints along the way
    // waypoints are followed in order of waypts list
    // set travel mode to DRIVING (route will be drawn accordingly)
    var request = {
        origin: origin,
        destination: origin,
        waypoints: waypts,
        travelMode: 'DRIVING'
    };

    // send the request to the DirectionsService
    directionsService.route(request, function(result, status){
        // if the response status is OK, then draw the resulting route on the map using the DirectionsRenderer's setDirections method
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
    });
}

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
async function drawMap(destinations,matrixType,algorithm){
    if(map === undefined){
        console.log("hello");
        initMap();
    }
    else{
        directionsRenderer.setMap(null); 
        directionsRenderer.setMap(map);
        setMapOnAll(null);
    }
    var destCoords = [];
    // convert user inputted destination coordinates to coordinate objects
    // create a marker for each destination 
    console.log(destinations);
    for (let i = 0; i < destinations.length; i++) {
        if(destinations[i].length != 0){
            console.log(coords);
            var coords = await getPlace(destinations[i]).catch(() => {
                    var header = document.getElementById('welcome'); 
                    header.innerText= "ERROR: A destination was entered that is not valid. Try again.";
                    header.style.color= "red";
                    console.log("inputted address is undefined!")    
                    var submitButtons = document.querySelectorAll('.submit-button');
                    sleep(2000).then(() => { 
                        for(let i = 0; i < submitButtons.length; i++){
                            submitButtons[i].style.display = "block";
                        }
                    });
                    return undefined;
            });
            if(coords == undefined){
                return;
            }
            destCoords.push(coords);
        }
    }


    console.log(destCoords);

    // the origin coordinates are the first (and last) coordinates in the list that contains all destination coords
    var originCoords = destCoords[0];

    // center the map's view on the origin location
    map.setCenter(originCoords);


    // obtian the distance matrix
    var matrices = await getMatrix(destCoords);
    var distanceMatrix = matrices.distanceMatrix;
    var durationMatrix = matrices.durationMatrix;

    // obtain the optimal route from the origin to the waypoints and back to the origin, optimized for reducing distance traveled
    // this returns the order in which the destinations in the destCoords list should be traveled (by indices)
    console.log(matrices.valid);
    if(matrices.valid == true){
        var header = document.getElementById('welcome'); 
        header.innerText= "Enter a set of addresses!";
        header.style.color= "black";
        if(matrixType == "distance"){
            var optimalRoute = await getOptimalRoute(algorithm,distanceMatrix,destCoords);
            console.log("distance");
        }
        else{
            var optimalRoute = await getOptimalRoute(algorithm,durationMatrix,destCoords);
            console.log("duration");
        } 
    }
    else{
        var header = document.getElementById('welcome'); 
        header.innerText= "ERROR: A destination was entered that is not connected to the origin by land. Try again.";
        header.style.color= "red";
        console.log("distance or duration between destinations is undefined!")    
        var submitButtons = document.querySelectorAll('.submit-button');
        sleep(2000).then(() => { 
            for(let i = 0; i < submitButtons.length; i++){
                submitButtons[i].style.display = "block";
            }
        });
        return;
    }
    console.log("Optimal route:",optimalRoute);
    // sort the destinations in order of the optimalRoute, draw the route on the map
    var sortedDestCoords = optimalRoute.map(i => destCoords[i]);

    markers = [];
    for (let i = 0; i < sortedDestCoords.length; i++) {
        // if the destination is not the final destination, then create a Marker object and add it to the global list
        // (this is to avoid overlapping the origin location with two markers
        if ( i != sortedDestCoords.length - 1){
            addMarker(sortedDestCoords[i],i);
        }
    }
    // draw the Markers on the map
    setMapOnAll(map);

    drawRoute(sortedDestCoords);
    var submitButtons = document.querySelectorAll('.submit-button');
    sleep(2000).then(() => { 
        for(let i = 0; i < submitButtons.length; i++){
            submitButtons[i].style.display = "block";
        }
    });
}
// https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
    
/****************************************************************************************************************************************************************************
EVENT LISTENERS

These are event listeners that attach to a specific element in the HTML template (or DOM object) and call a function when triggered.

****************************************************************************************************************************************************************************/
// Wait for DOM to load before manipulating elements

async function autoCompletify(text_input){
    const options = {
        componentRestrictions: {country: "us" },
        fields: ["address_components","geometry","name"],
    };
    const auto = new google.maps.places.Autocomplete(text_input);
}

document.addEventListener("DOMContentLoaded", function() {
    var originEntry = document.getElementById('origin'); 
    var destEntries = document.querySelectorAll('.dest-entry');
    var submitButtons = document.querySelectorAll('.submit-button');
    autoCompletify(originEntry);
    for(let i = 0; i < destEntries.length; i++){
        autoCompletify(destEntries[i]); 
    }

    // If 'submit' button is clicked:
    // Then calculate distance matrix, send coordinates and distances to backend
    //document.getElementById('dest-form').addEventListener('submit', (e) => {
    document.getElementById('submit-distance-genetic').addEventListener('click', (e) => {
        // prevent form submission from reloading the page
        e.preventDefault();
        for(let i = 0; i < submitButtons.length; i++){
            submitButtons[i].style.display = "none";
        }
      
        // value of the user's input to the 'Origin:' text input field
        var origin = document.getElementById('origin').value;
        console.log(origin);

        // a list of elements that belong to the class 'dest-entry'
        // a.k.a. all text input elements with the label 'Destination:'
        var destEntries = document.querySelectorAll('.dest-entry');

        // a list of user inputted destinations
        var destinations = [];

        // the origin point is the starting destination, push it to the destinations list
        destinations.push(origin);

        // push the values of all text input elements that belong to the class 'dest-entry' to the destinations list
        for(let i = 0; i < destEntries.length; i++){
           destinations.push(destEntries[i].value);
        } 

        // the origin point is also the final destination, push it to the destinations list
        destinations.push(origin);
        // draw a Google Maps Javascript API interactive map that displays an optimal route between the inputted destinations
        // (starting at destinations[0] and ending at destinations[-1]
        drawMap(destinations,'distance','genetic');
    });
    document.getElementById('submit-distance-mst').addEventListener('click', (e) => {
        // prevent form submission from reloading the page
        e.preventDefault();
        for(let i = 0; i < submitButtons.length; i++){
            submitButtons[i].style.display = "none";
        }
       
        // value of the user's input to the 'Origin:' text input field
        var origin = document.getElementById('origin').value;

        // a list of elements that belong to the class 'dest-entry'
        // a.k.a. all text input elements with the label 'Destination:'
        var destEntries = document.querySelectorAll('.dest-entry');

        // a list of user inputted destinations
        var destinations = [];

        // the origin point is the starting destination, push it to the destinations list
        destinations.push(origin);

        // push the values of all text input elements that belong to the class 'dest-entry' to the destinations list
        for(let i = 0; i < destEntries.length; i++){
           destinations.push(destEntries[i].value);
        } 

        // the origin point is also the final destination, push it to the destinations list
        destinations.push(origin);
        // draw a Google Maps Javascript API interactive map that displays an optimal route between the inputted destinations
        // (starting at destinations[0] and ending at destinations[-1]
        drawMap(destinations,'distance','MST');
    });

    document.getElementById('submit-duration-genetic').addEventListener('click', (e) => {
        // prevent form submission from reloading the page
        e.preventDefault();
        for(let i = 0; i < submitButtons.length; i++){
            submitButtons[i].style.display = "none";
        }
       
        // value of the user's input to the 'Origin:' text input field
        var origin = document.getElementById('origin').value;

        // a list of elements that belong to the class 'dest-entry'
        // a.k.a. all text input elements with the label 'Destination:'
        var destEntries = document.querySelectorAll('.dest-entry');

        // a list of user inputted destinations
        var destinations = [];

        // the origin point is the starting destination, push it to the destinations list
        destinations.push(origin);

        // push the values of all text input elements that belong to the class 'dest-entry' to the destinations list
        for(let i = 0; i < destEntries.length; i++){
           destinations.push(destEntries[i].value);
        } 

        // the origin point is also the final destination, push it to the destinations list
        destinations.push(origin);
        // draw a Google Maps Javascript API interactive map that displays an optimal route between the inputted destinations
        // (starting at destinations[0] and ending at destinations[-1]
        drawMap(destinations,'duration','genetic');
    });
    document.getElementById('submit-duration-mst').addEventListener('click', (e) => {
        // prevent form submission from reloading the page
        e.preventDefault();
        for(let i = 0; i < submitButtons.length; i++){
            submitButtons[i].style.display = "none";
        }
       
        // value of the user's input to the 'Origin:' text input field
        var origin = document.getElementById('origin').value;

        // a list of elements that belong to the class 'dest-entry'
        // a.k.a. all text input elements with the label 'Destination:'
        var destEntries = document.querySelectorAll('.dest-entry');

        // a list of user inputted destinations
        var destinations = [];

        // the origin point is the starting destination, push it to the destinations list
        destinations.push(origin);

        // push the values of all text input elements that belong to the class 'dest-entry' to the destinations list
        for(let i = 0; i < destEntries.length; i++){
           destinations.push(destEntries[i].value);
        } 

        // the origin point is also the final destination, push it to the destinations list
        destinations.push(origin);
        // draw a Google Maps Javascript API interactive map that displays an optimal route between the inputted destinations
        // (starting at destinations[0] and ending at destinations[-1]
        drawMap(destinations,'duration','MST');
    });
   
    // if 'add destination' button is clicked:
    // Then create a text entry input field and append it to the form 
    document.getElementById('add-dest-bttn').addEventListener('click', (e) => {
        // the number of destination entry boxes that currently exist in the HTML
        var numDests = document.querySelectorAll('.dest-entry').length + 1;
        if(numDests <= 9){
            // create a string to be used in as an HTML id attribute, represents what 'dest' number the element is
            var destId = "dest" + String(numDests);

            // create a new HTML <label> element and set the 'for' attribute to the destId, also set the 'text' attribute to label what destination it is
            var newDestLabel = document.createElement("label");
            newDestLabel.htmlFor = destId;
            newDestLabel.textContent = "Destination " + numDests + ":";
            newDestLabel.id = "destlabel" + String(numDests);
            
            // create a new HTML <input> element and set the 'id' attribute to destId, 'class' attribute to 'dest-entry', 'name' attribute to destId
            var newDestInput = document.createElement("input");
            newDestInput.id = destId;
            newDestInput.className = "dest-entry";
            newDestInput.name = destId;
            autoCompletify(newDestInput);

            var breakId = "break" + String(numDests);
            var breakElement = document.createElement("br");
            breakElement.id = breakId;
            var whitespace = document.createTextNode(" ");
            // the element on the HTML page with the id 'dest-form' 
            var destinationEntryForm = document.getElementById('dest-form');

            // append the newly created <label> and <input> elements to the form
            destinationEntryForm.append(newDestLabel,whitespace,newDestInput,breakElement);
        }
    }); 
        document.getElementById('remove-dest-bttn').addEventListener('click', (e) => {
        // the number of destination entry boxes that currently exist in the HTML
        var numDests = document.querySelectorAll('.dest-entry').length;
        if (numDests > 1){
                
            // create a string to be used in as an HTML id attribute, represents what 'dest' number the element is
            var destInputId = "dest" + String(numDests);
            var destLabelId = "destlabel" + String(numDests);
            var breakId = "break" + String(numDests);

            var lastDestInput = document.getElementById(destInputId);
            var lastDestLabel = document.getElementById(destLabelId);
            var lastBreak = document.getElementById(breakId);
            lastDestInput.remove();
            lastDestLabel.remove();
            lastBreak.remove();
        }
    });
        document.getElementById('clear-dests-bttn').addEventListener('click', (e) => {
        // the number of destination entry boxes that currently exist in the HTML
        var destEntries = document.querySelectorAll('.dest-entry');
        for(let i = 0; i < destEntries.length;i++){
            // create a string to be used in as an HTML id attribute, represents what 'dest' number the element is
            destEntries[i].value = "";
        }
    });
});
