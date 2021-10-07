var API_KEY = "INSERT API KEY HERE";

// NEED TO USE FLASK/AJAX TO SAVE/REMEMBER HOW MANY DESTINATIONS ARE CREATED 
// THE numDests variable implemenation is of poor design

// Wait for DOM to load before manipulating elements
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('dest-form').addEventListener('submit', (e) => {
        e.preventDefault();
        var numDests = document.querySelectorAll('.dest-form').length;
        var coords = document.getElementById('origin').value;
        var script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY + "&callback=initMap";
        script.async = true;
        window.initMap = function() {
            var latitude = parseFloat(coords.split(",")[0]);
            var longitude = parseFloat(coords.split(",")[1]);
            const map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: latitude, lng: longitude},
                    zoom: 12,
            });
            const marker = new google.maps.Marker({
                    position: {lat : latitude, lng: longitude},
                    map: map,
            });
        };
        document.head.appendChild(script);
    });
    
    document.getElementById('add-dest-bttn').addEventListener('click', (e) => {
        var numDests = document.querySelectorAll('.dest-form').length + 1;
        var destId = "dest" + String(numDests);
        var newDestLabel = document.createElement("label");
        newDestLabel.htmlFor = destId;
        newDestLabel.textContent = "Destination " + numDests + ":";

        var newDestInput = document.createElement("input");
        newDestLabel.id = destId;
        newDestLabel.className = "dest-input";
        newDestLabel.name = destId;

        var destinationEntryForm = document.getElementById('dest-form');
        destinationEntryForm.append(newDestLabel,newDestInput);
    });
        
});


