// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (response) {
    // Once we get a response, send the data.Features object to the createFeatures function
    createFeatures(response.features);
});

function createFeatures(earthquakeData) {
// Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachfeature(features, layer) {
        layer.bindPopup("<h3>" + features.properties.place + "</h3><hr><p>" + new Date(features.properties.time) + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachfeature,
        pointToLayer: function (features, latlng) {
            var geoJSONMarker = {
                radius: markerSize(features.properties.mag),
                fillColor: getColor(features.properties.mag),
                color: "white",
                weight: 0.5,
                opacity: 0.5,
                fillOpacity: 0.8
            };

            return L.circleMarker(latlng, geoJSONMarker);
        },
    })
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
};

function createMap(earthquakes) {
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });

   
    //Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap
        // "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [27.503, -99.507],
        zoom: 3,
        layers: [streetmap, earthquakes]
    });

    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    
    const legend = L.control({ position: 'bottomright' });
    console.log(legend)
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'legend');
         
        div.innerHTML += "<h4>MAGNITUDE</h4>";    
        div.innerHTML += '<i style="background: #663399"></i><span>>=5.0</span><br>';
        div.innerHTML += '<i style="background: #9370DB"></i><span>>=4.0</span><br>';
        div.innerHTML += '<i style="background: #EE82EE"></i><span>>=3.0</span><br>';
        div.innerHTML += '<i style="background: #D88FD8"></i><span>>=2.0</span><br>';
        div.innerHTML += '<i style="background: #E6E6FA"></i><span>< 2.0</span><br>';
        
          return div; 
        
        };
        legend.addTo(myMap);    
      };




function getColor(d) {
  return d > 5 ? '#663399':
         d > 4 ? '#9370DB':
         d > 3 ? '#EE82EE': 
         d > 2 ? '#DDA0DD':
         d < 2 ? '#D8BFD8':
                 '#E6E6FA';
  };
     
    

function markerSize(mag) {
    return mag * 3
};
