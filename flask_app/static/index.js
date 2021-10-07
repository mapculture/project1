var API_KEY = "INSERT API KEY HERE";

// NEED TO USE FLASK/AJAX TO SAVE/REMEMBER HOW MANY DESTINATIONS ARE CREATED 
// THE numDests variable implemenation is of poor design

$(document).ready(function () { 
    $("#destEntry").submit(function(event) {
        event.preventDefault();
        var numDests = $('.destInput').length;
        //var coords = $("#dest1").val();
        var coords = $("#origin").val();
        var script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=" + API_KEY + "&callback=initMap";
        script.async = true;
        window.initMap = function() {
            var latitude = parseFloat(coords.split(",")[0]);
            var longitude = parseFloat(coords.split(",")[1]);
            const map = new google.maps.Map(document.getElementById("map"), {
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
    
    $("#addDest").click(function(){
        var numDests = $('.destInput').length + 1;
        var destId = "dest" + String(numDests);
        var newDestLabel = $("<label for='" + destId + "'>Destination " + numDests + ":</label>");
        var newDestInput = $("<input class='destInput' type='text' width='10' autocomplete='off' id='" + destId + "' name='" + destId + "'/>");
        newDestLabel.appendTo("#destEntry"); 
        newDestInput.appendTo("#destEntry"); 
    });
        
});


