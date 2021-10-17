// Directions API is necessary to draw routes between markers

//TODO: Improper input handling... no input, wrong coordinate syntax

let map;
let directionsService;
let directionsRenderer;
let placesService;
let markers = [];

function initMap(){
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        // stop the DirectionsRenderer from producing its own markers
        //suppressMarkers: true
        suppressMarkers: false
    });
    map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
    });
    placesService = new google.maps.places.PlacesService(map);
    directionsRenderer.setMap(map);
}

function getPlace(address){
    var request = {
        query: address,
        fields: ['name','geometry'],
    }; 
    return new Promise((resolve, reject) => {
        placesService.findPlaceFromQuery(
            request,
            (response, status) => {
                if(status == 'OK'){
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

function drawRoute(dests) {
    var origin = dests[0];
    // slice the first and last destinations (the origin)
    dests = dests.slice(1,-1);
    var waypts = [];
    // create a waypoint for each destination in the list
    for(i = 0; i < dests.length; i++){
        waypts.push({
            location: dests[i],
            stopover: true,
        });
    }

    // create a request for round-trip directions (from origin to origin)
    // and visit all waypoints along the way
    // (waypoints followed in order of waypts list)
    var request = {
        origin: origin,
        destination: origin,
        waypoints: waypts,
        travelMode: 'DRIVING'
    };
    // send the request to the DirectionsService
    directionsService.route(request, function(result, status){
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
    });
}

// add a marker to the 'markers' list
// markers are labeled A-Z in order of their priority in the route
function addMarker(coords,index){
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const marker = new google.maps.Marker({
        position: coords,
        label: labels[index],
        map: map,
    });
    // apply changes to the map
    markers.push(marker);
}

// draw all markers from the markers list onto the map
function setMapOnAll(map){
    for (let i=0; i<markers.length; i++){
        markers[i].setMap(map);
    }
}

// create distance matrix given origin and destinations (list)
// distanceMatrixService will send a request to Google for the distance matrix
// a response to the request will be fed back to the callback function
// distance results are in km
// https://developers.google.com/maps/documentation/javascript/distancematrix#distance_matrix_parsing_the_results
// Receive and parse Google's response to our distance matrix request
// The rows of the matrix correspond to the origin addresses
// The rows' elements correspond to the destination addresses
async function getMatrix(dests){
    var origin = dests[0];
    var distanceMatrixService = new google.maps.DistanceMatrixService();
    // create an n x n distance matrix
    // calculate the distance and time between the origin to each destination
    // calculate the distance and time between each destination to each other destination
    // calculate the distance and time between each destination to the origin
    // note: this also counts distance/time from a location to itself (i.e. origin to origin)
    const response = await distanceMatrixService.getDistanceMatrix({
        origins: dests.slice(0,-1),
        destinations: dests.slice(0,-1),
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
    });
    console.log(response);
    //origins and destinations are the same locations in the same order
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    var distanceMatrix = new Array(origins.length);
    var durationMatrix = new Array(origins.length);
    for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        distanceMatrix[i] = new Array(results.length);
        durationMatrix[i] = new Array(results.length);
        
        for (var j = 0; j < results.length; j++) {
            var element = results[j];
            var from = origins[i];
            var to = destinations[j];
            var distance = element.distance.value;
            var duration = element.duration.value;
            distanceMatrix[i][j] = distance;
            durationMatrix[i][j] = duration;

            console.log("from:",from,"\n","to:",to,"\n","distance:",distance,"\n","duration:",duration);
        }
    }
    console.log("Distance Matrix:", distanceMatrix,"\n","Duration matrix:",durationMatrix);
    return distanceMatrix;
}

async function getOptimalRoute (matrix, destinations){
    const flask_response = await fetch('/test', {
        method: 'POST',
        body: JSON.stringify({'numDests': destinations.length-1, 'distMatrix': matrix}),
    });
    const data = await flask_response.json();
    console.log('POST response:', data);
    // an array that represents optimal destination order
    var optimal_route = data['optimal_route'];
    return optimal_route;
}

async function drawMap(destinations){
    initMap();
    var destCoords = [];
    // convert user inputted destination coordinates to coordinate objects
    // create a marker for each destination 
    console.log(destinations);
    for (let i = 0; i < destinations.length; i++) {
        var coords = await getPlace(destinations[i]);
        destCoords.push(coords);
    }
    console.log(destCoords);
    var originCoords = destCoords[0];
    map.setCenter(originCoords);
    // calculate the distance matrix
    var distanceMatrix = await getMatrix(destCoords);
    var optimalRoute = await getOptimalRoute(distanceMatrix,destCoords);
    console.log(optimalRoute);
    drawRoute(optimalRoute.map(i => destCoords[i]));
}
    
// Wait for DOM to load before manipulating elements
document.addEventListener("DOMContentLoaded", function() {
    // If 'submit' button is clicked:
    // Then calculate distance matrix, send coordinates and distances to backend
    document.getElementById('dest-form').addEventListener('submit', (e) => {
        // prevent form submission from reloading the page
        e.preventDefault();
        
        var origin = document.getElementById('origin').value;

        // a list of destination elements 
        var destEntries = document.querySelectorAll('.dest-entry');
        var destinations = [];

        // origin point is the starting destination
        destinations.push(origin);

        for(let i = 0; i < destEntries.length; i++){
           destinations.push(destEntries[i].value);
        } 
        // origin point is also the final destination
        destinations.push(origin);
        drawMap(destinations);
    });
    
    document.getElementById('add-dest-bttn').addEventListener('click', (e) => {
        var numDests = document.querySelectorAll('.dest-entry').length + 1;
        var destId = "dest" + String(numDests);
        var newDestLabel = document.createElement("label");
        newDestLabel.htmlFor = destId;
        newDestLabel.textContent = "Destination " + numDests + ":";

        var newDestInput = document.createElement("input");
        newDestInput.id = destId;
        newDestInput.className = "dest-entry";
        newDestInput.name = destId;

        var destinationEntryForm = document.getElementById('dest-form');
        destinationEntryForm.append(newDestLabel,newDestInput);
    });
});
