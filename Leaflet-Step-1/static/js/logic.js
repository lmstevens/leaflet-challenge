// Create a map object
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Assemble API query URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grab the data with d3
d3.json(url, function (data) {
    var earthquakes = data.features
    console.log(earthquakes)
    // loop through data
    for (var i = 0; i < earthquakes.length; i++) {

        console.log(earthquakes[i])
        console.log(earthquakes[i].geometry.coordinates)

        var color = "";
        var fillOpacity = "";
        if (earthquakes[i].properties.mag < 1) {
            color = "purple"
            fillOpacity = .16;
        }
        else if (earthquakes[i].properties.mag < 2) {
            color = "blue"
            fillOpacity = .32;
        }
        else if (earthquakes[i].properties.mag < 3) {
            color = "green"
            fillOpacity = .48;
        }
        else if (earthquakes[i].properties.mag < 4) {
            color = "yellow"
            fillOpacity = .64;
        }
        else if (earthquakes[i].properties.mag < 5) {
            color = "orange"
            fillOpacity = .80;
        }
        else {
            color = "red"
            fillOpacity = .90;
        }

        // Add circles to map
        L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
            fillOpacity: .75,
            color: "",
            fillColor: color,
            // Adjust radius
            radius: earthquakes[i].properties.mag * 25000
        }).bindPopup("<h1>" + earthquakes[i].properties.place + "</h1> <hr> <h3>Magnitude: " + earthquakes[i].properties.mag + "</h3>")
        .addTo(myMap);

    }
    
    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ["0-1","1-2","2-3","3-4","4-5","5+"];
        var colors = ["purple","blue","green","yellow","orange","red"];
        var labels = [];

        // Add min & max
        var legendInfo = "<h1>Magnitudes</h1>" 
            var contents = "<div>"
            for (var i = 0; i < 6; i++) {
                var item = `<div class="legend-item" style = "background-color: ${colors[i]}"></div><div>${limits[i]}</div><br></br>`
                contents += item;
                
            }
            contents += "</div>"
            legendInfo += contents;
        div.innerHTML = legendInfo;

        // limits.forEach(function (limit, index) {
        //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        // });

        // div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

});