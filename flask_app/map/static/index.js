/*****************************************************************************************************************************************************************************
File Name: index.js
 
Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This Javascript file is used by the map.html template and enables the page to:
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
Last Modified: 11/02/2021

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
    // add every marker from the global markers list to the map
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

If the distance or duration of an element within the matrix is undefined, then the matrices are returned with the valid flag = false.

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

    // log Google's response to the console
    console.log("distanceMatrixService.getDistanceMatrix:",response);

    // instantiate distance matrix, duration matrix
    // 1D arrays, length corresponds to number of rows in the matrix produced by the response
    var distanceMatrix = new Array(response.rows.length);
    var durationMatrix = new Array(response.rows.length);

    // error handler, true by default, false if any distance/duration in the matrix is undefined
    var valid = true;

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

            // if the distance or duration between two waypoints are undefined
            // (returned from google)
            if(element.distance == undefined || element.duration == undefined){
                valid = false;
            }
            else{
                // the distance value in kilometers 
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

    // return the distanceMatrix, durationMatrix, and a boolean indicator of whether or not those matrices are valid
    return {'valid':valid,'distanceMatrix': distanceMatrix,'durationMatrix': durationMatrix,};
}

/****************************************************************************************************************************************************************************
Function getOptimalRoute

This function sends a POST HTTP request to the '/optimalroute' URL of the Flask server and receives a response containing the optimal route produced by a TSP algorithm
The request consists of the number of inputted destinations and the distance or destination matrix as a JSON.

The Flask server responds with a JSON that contains the optimal order in which to travel to each destination (determined by TSP algorithm).
The async/await keywords allow the the function to operate asynchronously. The function will pause until the request completes.

The algorithm parameter can be either 'MST' or 'genetic'.
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

    // sanity-check confirmation to confirm that the requested algorithm was used by the backend
    // logging purposes only
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
FUNCTION: displayMessage

This function populates a div on the html page with text. It is used to display error messages and help messages to the user.

ERROR messages are displayed with red text.
HELP messages are displayed with white text.
****************************************************************************************************************************************************************************/
function displayMessage(message,isError){
    var messageDiv = document.getElementById('show-error'); 
    messageDiv.innerText = message;
    // if the message is an error message
    if(isError){
        // color the text red
        messageDiv.style.color= "red";
    }
    // else the message is a help message
    else{
        // color the text white
        messageDiv.style.color="white";
    }
}
/****************************************************************************************************************************************************************************
FUNCTION: sleep

This function returns a promise after a timeout.
Using this function requires that you call it from within an asynchronous function and use a 'then' callback to perform some operations after it resolves.

Source: This function was taken from: https://www.sitepoint.com/delay-sleep-pause-wait/
****************************************************************************************************************************************************************************/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/****************************************************************************************************************************************************************************
FUNCTION: hideElementForSeconds

This function hides an html element from the user for a given amount of time.
****************************************************************************************************************************************************************************/
async function hideElementForSeconds(element,ms){
    // hide the element
    element.style.display = "none";
    // sleep some milliseconds
    sleep(ms).then(() => {
            // un-hide the element
            element.style.display = "block";
    });
}

/****************************************************************************************************************************************************************************
FUNCTION: clearMap

This function clears any existing routes and markers from the global map object.
****************************************************************************************************************************************************************************/
function clearMap(){
    // dissassociate the directionsRenderer (route drawer) from the map
    directionsRenderer.setMap(null); 
    // remove all markers from the map
    setMapOnAll(null);
}

/****************************************************************************************************************************************************************************
FUNCTION: drawMap

This is the main function that draws an interactive map with an optimal route between an origin and a set of destinations (optimizing for either distance or duration)
This function takes in a list of user inputted location strings, where the first and last locations are the same. (Round trip).
It initializes the Google Maps Javascript API map, then calls the helper function getPlace to convert the user inputted destinations into coordinates.
A marker is created at each set of coordinates (except for the final location, to not overlap with the starting location's marker -- as they are the same).
The distance and duration matrices are obtained by calling getMatrix, a call is then made to getOptimalRoute with that function as input.
Finally, the route is drawn on the map using drawRoute.

matrixType can be either: 'distance' or 'duration'
algorithm can be either: 'MST' or 'genetic'

Note: The origin is both a starting location and an ending location on the route (the first and last index of the destinations list is the origin location). 
****************************************************************************************************************************************************************************/
async function drawMap(destinations,matrixType,algorithm){
    // if map has not yet been initialized
    if(map === undefined){
        // initialize the map
        initMap();
    }
    // else map already exists
    else{
        // clear all routes and markers drawn from map
        clearMap();
        // reassociate the directionsRenderer with the map
        // (required after clearing)
        directionsRenderer.setMap(map);
    }

    // a list of LatLng coordinates for each destination entered by the user
    var destCoords = [];

    // convert user inputted destination coordinates to coordinate objects
    // create a marker for each destination 
    for (let i = 0; i < destinations.length; i++) {
        // if the inputted destination is a non-empty string 
        if(destinations[i].length != 0){
            // convert user input address to a coordinate
            // returns undefined if there is an error
            var coords = await getPlace(destinations[i]).catch((e) => {
                    console.log("getPlace request failed with status:",e);
                    // user is requesting too many coordinates too quickly
                    if(e == "OVER_QUERY_LIMIT"){
                        displayMessage("ERROR: You have requested too many queries in too short of a time. Please wait at least 30 seconds before trying again.",true);
                    } 
                    // user input address returned zero results
                    else if(e == "ZERO_RESULTS"){
                        displayMessage("ERROR: A destination was entered that is not valid. Try again.",true);
                    }
                    // catch-all other errors
                    else{
                        displayMessage("ERROR: Request failed for an unknown reason. Please wait some time and try again.",true);
                    }
                    return undefined;
            });

            // if coords are not defined (due to a querying error, user input error)
            // remove the last successful route from the map when displaying error messages
            if(coords == undefined){
                clearMap();
                return;
            }
            // add the coords to the list
            else {
                destCoords.push(coords);
            }
        }
    }
    // the origin coordinates are the first (and last) coordinates in the list that contains all destination coords
    var originCoords = destCoords[0];

    // center the map's view on the origin location
    map.setCenter(originCoords);

    // obtain the distance matrix and duration matrix for the set of coordinates converted from user inputs
    var matrices = await getMatrix(destCoords).catch((e) => {
            // catch and display getMatrix request failure as an error
            // generally, this error will only occur if the user is making too many requests
            console.error(e.message);
            return undefined;
    });

    // if the matrices are undefined (there was an error obtaining them)
    // remove the last successful route from the map when displaying error messages, then stop execution
    if (matrices == undefined){
        displayMessage("ERROR: You have requested too many queries in too short of a time. Please wait at least 30 seconds before trying again.",true);
        clearMap();
        return;
    }

    // the distance matrix received from the request to Google
    var distanceMatrix = matrices.distanceMatrix;
    // the duration matrix received from the request to Google
    var durationMatrix = matrices.durationMatrix;

    // if the matrices obtained from getMatrix do not have any elements with undefined distances/durations
    if(matrices.valid == true){
        // obtain the optimal route from the origin to the waypoints and back to the origin, optimized for reducing distance traveled
        if(matrixType == "distance"){
            // this returns the order in which the destinations in the destCoords list should be traveled (by indices)
            var optimalRoute = await getOptimalRoute(algorithm,distanceMatrix,destCoords);
        }
        else{
            // obtain the optimal route from the origin to the waypoints and back to the origin, optimized for reducing time traveled
            // this returns the order in which the destinations in the destCoords list should be traveled (by indices)
            var optimalRoute = await getOptimalRoute(algorithm,durationMatrix,destCoords);
        } 
    }
    else{
        displayMessage("ERROR: A destination was entered that is not connected to the origin by land. Try again.",true);
        // remove the last successful route from the map when displaying error messages, then stop execution
        clearMap();
        return;
    }
    // sort the destinations in order of the optimalRoute, draw the route on the map
    var sortedDestCoords = optimalRoute.map(i => destCoords[i]);

    // create a marker for each location in the sorted location in the list
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
    // draw the route on the map
    drawRoute(sortedDestCoords);
}
    
/****************************************************************************************************************************************************************************
FUNCTION: autoCompletify

This function converts a standard text input HTML element to a Google Places Autocomplete text input.
****************************************************************************************************************************************************************************/
async function autoCompletify(textInput){
    // set Google Places Autocomplete options
    const options = {
        componentRestrictions: {country: "us" },
        fields: ["address_components","geometry","name"],
    };
    // instantiate a new Autocomplete box using the textInput HTML
    const auto = new google.maps.places.Autocomplete(textInput);
}

/****************************************************************************************************************************************************************************
EVENT LISTENERS

These are event listeners that attach to a specific element in the HTML template (or DOM object) and call a function when triggered.

****************************************************************************************************************************************************************************/
// Wait for the DOM to finish loading before manipulating it
document.addEventListener("DOMContentLoaded", function() {
    // the origin address text input HTML element
    var originEntry = document.getElementById('origin'); 

    // convert the originEntry from a text field to a Google Places Autocomplete text field
    autoCompletify(originEntry);

    // all destination address text input HTML elements 
    var destEntries = document.querySelectorAll('.dest-entry');

    // convert all destEntries from text fields to Google Places Autocomplete text fields
    for(let i = 0; i < destEntries.length; i++){
        autoCompletify(destEntries[i]); 
    }

    // the "Draw Route" submit button
    var submitButton = document.getElementById('submit-bttn');
   
    // the option bubbles (HTML radio inputs) for: "Distance vs. Duration" and "Prim's vs. Genetic"
    var radioDistance = document.getElementById('radio-distance');
    var radioDuration = document.getElementById('radio-duration');
    var radioMST = document.getElementById('radio-MST');
    var radioGenetic = document.getElementById('radio-genetic');

    // the div where messages are displayed to the user (either ERROR messages or HELP messages)
    var header = document.getElementById('show-error'); 

    // If 'submit' button is clicked:
    // Then calculate matrices, send coordinates and distances to backend, receive optimal route, draw route onto Google map
    submitButton.addEventListener('click', (e) => {
        // prevent form submission from reloading the page
        e.preventDefault();

        // hide the submitButton for 2 seconds
        // this is to prevent the user from spamming the submit button and causing a Google Request Cooldown
        hideElementForSeconds(submitButton,2000);

        // remove any ERROR messages or HELP messages
        header.innerText= "";
      
        // value of the user's input to the 'Origin:' text input field
        var origin = document.getElementById('origin').value;

        // a list of elements that belong to the class 'dest-entry'
        // a.k.a. all text input elements with the label 'Destination:'
        var destEntries = document.querySelectorAll('.dest-entry');

        // a list of user inputted destinations
        var destinations = [];

        // the origin point is the starting destination, push it to the destinations list
        destinations.push(origin);

        // flag that keeps track of whether or not all of the inputted destinations are empty
        var allEmpty = true;

        // push the values of all text input elements that belong to the class 'dest-entry' to the destinations list
        for(let i = 0; i < destEntries.length; i++){
            // If a destination entry is empty
            // change the allEmpty flag
            if(destEntries[i].value != ""){
                allEmpty = false;
            }
            destinations.push(destEntries[i].value);
        } 
        // if the user did not provide any input for the origin 
        // or if the user did not provide any destination addresses
        if(origin == "" || allEmpty){
            // display an error message and kill execution
            displayMessage("ERROR: A route requires an origin and at least one destination. Please try again.",true);
            // if the map is defined when this error occurs, then clear the map of any routes and markers
            if(map !== undefined){
                clearMap();
            }
            return;
        }
        // the origin point is also the final destination, push it to the destinations list
        destinations.push(origin);


        // draw a Google Maps Javascript API interactive map that displays an optimal route between the inputted destinations
        // (starting at destinations[0] and ending at destinations[-1]

        // draw the map and route based on the options the user selected:

        // "Draw a route that minimizes distance and uses the MST algorithm"
        if(radioDistance.checked && radioMST.checked){
            drawMap(destinations,'distance','MST');
        }
        // "Draw a route that minimizes time and uses the MST algorithm"
        else if(radioDuration.checked && radioMST.checked){
            drawMap(destinations,'duration','MST');
        }
        // "Draw a route that minimizes distance and uses the genetic algorithm"
        else if(radioDistance.checked && radioGenetic.checked){
            drawMap(destinations,'distance','genetic');
        }
        // "Draw a route that minimizes time and uses the genetic algorithm"
        else if(radioDuration.checked && radioGenetic.checked){
            drawMap(destinations,'duration','genetic');
        }
    });

    // if 'add destination' button is clicked:
    // Then create a text entry input field and append it to the form 
    document.getElementById('add-dest-bttn').addEventListener('click', (e) => {
        // the number of destination entry boxes that currently exist in the HTML
        var numDests = document.querySelectorAll('.dest-entry').length + 1;

        // limit the number of destination input fields to 9
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

            // create a new HTML <br> element to better format the input form
            var breakId = "break" + String(numDests);
            var breakElement = document.createElement("br");
            breakElement.id = breakId;

            // create an HTML whitespace element to help formatting
            var whitespace = document.createTextNode(" ");
            // the element on the HTML page with the id 'dest-form' 
            var destinationEntryForm = document.getElementById('dest-form');

            // append the newly created <label>, whitespace, <input>, and <br> elements to the form in that order
            destinationEntryForm.append(newDestLabel,whitespace,newDestInput,breakElement);
        }
    }); 

    // If 'remove destination' button is clicked:
    // Then remove the last text input HTML element from the form. (If there is only one text input element left, then just clear that element's inner text)
    document.getElementById('remove-dest-bttn').addEventListener('click', (e) => {
        // the number of destination entry boxes that currently exist in the HTML
        var numDests = document.querySelectorAll('.dest-entry').length;

        // create a string to be used as an HTML id attribute, represents what 'dest' number the element is
        var destInputId = "dest" + String(numDests);
        // get the last destination text input element in the form div
        var lastDestInput = document.getElementById(destInputId);

        // only remove a destination input if it is not the only destination left
        // always leave the first destination input because it is required for app functionality
        if (numDests > 1){
            // create a string to be used as an HTML id attribute, represents what 'destLabel' number the element is
            var destLabelId = "destlabel" + String(numDests);
            // create a string to be used as an HTML id attribute, represents what 'break' number the element is
            var breakId = "break" + String(numDests);

            // get the last destination label element in the form div
            var lastDestLabel = document.getElementById(destLabelId);
            // get the last destination line break element in the form div
            var lastBreak = document.getElementById(breakId);

            // remove the elements from the HTML
            lastDestInput.remove();
            lastDestLabel.remove();
            lastBreak.remove();
        }

        // else if there is only one destination input
        // do not remove its input box, instead change its value to be empty
        else{
            lastDestInput.value = "";
        }
            
    });
    // If 'clear destinations' button is clicked:
    // Clear the inner text for all text input HTML inputs in the form
    document.getElementById('clear-dests-bttn').addEventListener('click', (e) => {
        // the number of destination entry boxes that currently exist in the HTML
        var destEntries = document.querySelectorAll('.dest-entry');

        // set the value of all destination text input fields to empty space
        for(let i = 0; i < destEntries.length;i++){
            destEntries[i].value = "";
        }
    });

    // If the '?' (help) button is clicked:
    // Display a help message to the user that explains the difference between the genetic and MST algorithms 
    document.getElementById('help-bttn').addEventListener('click', (e) => {
        // display a message to the user
        // explain the differences between each algorithm
        displayMessage("Choosing an algorithm:\n\nIf you can wait, the Genetic algorithm will get you a close-to-optimum route.\n\nIf you're in a hurry, the Prim’s algorithm will get you an efficient route fast.",false);
    });
});
