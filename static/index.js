var API_KEY = "INSERT API KEY HERE";

$(document).ready(function () { 
    $("#coordinate_entry").submit(function(event) {
        event.preventDefault();
        var coords = $("#coords").val();
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
});


