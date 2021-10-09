// NEED TO USE FLASK/AJAX TO SAVE/REMEMBER HOW MANY DESTINATIONS ARE CREATED 
// THE numDests variable implemenation is of poor design

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

// Wait for DOM to load before manipulating elements
document.addEventListener("DOMContentLoaded", function() {
    // If 'submit' button is clicked:
    // Then calculate distance matrix, send coordinates and distances to backend
    document.getElementById('dest-form').addEventListener('submit', (e) => {
        // prevent form submission from reloading the page
        e.preventDefault();

        var originEntry = document.getElementById('origin').value;
        originCoords = stringToLatLng(originEntry); 

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
            dests.push(destCoords)
            addMarker(destCoords,i);
        }
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

