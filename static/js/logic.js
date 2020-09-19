

  // Store API query variables
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
  

  


// function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 10;
}

// function to return the color based on magnitude
function markerColor(magnitude) {
  if (magnitude > 5.0) {
    return 'red'
  } else if (magnitude > 4.0) {
    return 'orange'
  } else if (magnitude > 3.0) {
    return 'yellow'
  } else {
    return 'pink'
  }
}



// D3 to get json data
d3.json(url, function(response) {
  
  var earthquakes = L.geoJSON(response.features, {
    onEachFeature : addPopup,
    pointToLayer: addMarker
  });

// call function to create map
  createMap(earthquakes);

});

function addMarker(feature, location) {
  var options = {
    stroke: false,
    color: markerColor(feature.properties.mag),
    fillColor: markerColor(feature.properties.mag),
    radius: markerSize(feature.properties.mag)
  }

  return L.circleMarker(location, options);

}

// Define function for map features
function addPopup(feature, layer) {
    
    return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <h4>Magnitude: ${feature.properties.mag} </h4>`);
}


function createMap(earthquakes) {

    // Define streetmap layer
    var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    // var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    //   maxZoom: 18,
    //   id: "mapbox.dark",
    //   accessToken: API_KEY
    // });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetMap,
      
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map
    var myMap = L.map("map-id", {
      center: [37.09, -95.71],
      zoom: 10,
      layers: [streetMap, earthquakes]
    });
  
    // creating the legend
    var legend = L.control({position: 'bottomright'});

    // add legend to map
    legend.onAdd = function () {
    
        var div = L.DomUtil.create('div', 'info legend')
        
        div.innerHTML = "<h3>Magnitude Legend</h3><table><tr><th>>= 5</th><td>Red</td></tr><tr><th>>= 4</th><td>Orange</td></tr><tr><th>>= 3</th><td>Yellow</td></tr><tr><th>< 2</th><td>Pink</td></tr></table>";

        return div;
    };
    
    legend.addTo(myMap);

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  }
