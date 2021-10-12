// Places API or Geocoding API is necessary to convert addresses to coordinates
// In the meantime I will work strictly with coordinates

// Directions API is necessary to draw routes between markers

//TODO: Improper input handling... no input, wrong coordinate syntax
//TODO: Address geolocation -> coordinates 

let map;
let directionsService;
let directionsRenderer;
let markers = [];

function initMap(centerCoords){
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        // disable the DirectionsRenderer from producing its own markers
        suppressMarkers: true
    });
    map = new google.maps.Map(document.getElementById('map'), {
            center: centerCoords,
            zoom: 12,
    });
    directionsRenderer.setMap(map);
}

function displayRoute(origin, dests) {
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

// convert Strings in "LAT,LANG" format to google maps LatLng object
function stringToLatLng(s){
    var lat = parseFloat(s.split(",")[0]);
    var lng = parseFloat(s.split(",")[1]);
    var coords = new google.maps.LatLng(lat,lng);
    return coords;
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

function createDistanceMatrix(origin, dests){
    var distanceMatrixService = new google.maps.DistanceMatrixService();
    distanceMatrixService.getDistanceMatrix({
        // create an n x n distance matrix
        // calculate the distance and time between the origin to each destination
        // calculate the distance and time between each destination to each other destination
        // calculate the distance and time between each destination to the origin
        // note: this also counts distance/time from a location to itself (i.e. origin to origin)
        origins: [origin].concat(dests),
        destinations: [origin].concat(dests),
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
    }, distanceMatrixCallback);
}

// https://developers.google.com/maps/documentation/javascript/distancematrix#distance_matrix_parsing_the_results

// Receive and parse Google's response to our distance matrix request
// The rows of the matrix correspond to the origin addresses
// The rows' elements correspond to the destination addresses

function distanceMatrixCallback(response, status) {
    if (status == 'OK') {
        console.log("response data: ", response);
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

                console.log("from: " + from);
                console.log("to: " + to);
                console.log("distance: " + distance);
                console.log("duration: " + duration);
            }
        }
        console.log("Distance Matrix:");
        console.log(distanceMatrix);
        console.log("Duration Matrix:"); 
        console.log(durationMatrix);
    }
}
        
// Wait for DOM to load before manipulating elements
document.addEventListener("DOMContentLoaded", function() {
    // If 'submit' button is clicked:
    // Then calculate distance matrix, send coordinates and distances to backend
    document.getElementById('dest-form').addEventListener('submit', (e) => {
        // prevent form submission from reloading the page
        e.preventDefault();

        var originEntry = document.getElementById('origin').value;
        var originCoords = stringToLatLng(originEntry); 

        initMap(originCoords);
        addMarker(originCoords);

        // a list of destination elements 
        var destEntries = document.querySelectorAll('.dest-entry');
        // total destinations entered 
        var numDests = destEntries.length;
        var dests = [];

        // convert user inputted destination coordinates to coordinate objects
        // create a marker for each destination 
        for (let i = 0; i < numDests; i++) {
            var destCoords = stringToLatLng(destEntries[i].value);
            dests.push(destCoords);
            addMarker(destCoords,i);
        }
        // calculate the distance matrix
        createDistanceMatrix(originCoords,dests);
        // put all markers on the map
        setMapOnAll(map);
        // display the route on the map
        displayRoute(originCoords,dests);
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

