// Store our API endpoint inside queryUrl
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// GET request

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYmJhbGVzMTEiLCJhIjoiY2plYmptdmFwMGRydzJybzdpdzBxazk1aiJ9.ASSE0faIpkFAu87MR5RM0g");

// Define a map object
var myMap = L.map("map", {
  center: [46.06, -114.34],
  zoom: 4,
  layers: [darkmap]
});

// var events = []

d3.json(url, function (response) {
  // Once we get a response, send the data.features object to the createFeatures function
  // Loop through our data...
  function styleData(feature) {
    return {
      stroke: false,
      fillOpacity: .7,
      fillColor: getColor(feature.properties.mag),
      radius: circRad(feature.properties.mag)
    };
  }

  function getColor(d) {
    return d <= 1 ? "#2ECC71" :
      d <= 2 ? "#F9E79F" :
      d <= 3 ? "#F1C40F" :
      d <= 4 ? "#fd8d3c" :
      d <= 5 ? "#F39C12" :
      d > 5 ? "#E74C3C" :
      "#ffffff";
  }

  function circRad(r) {
    return r * 10;
  }

  // for (var i = 0; i < response.features.length; i++) { 
  //   events.push(
  L.geoJSON(response, {
    // needs to get called inside the L.geoJSON function
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleData,
    onEachFeature: function (feature, layer) {
      // // these need to go in a style funtion applied as a set style method
      //         stroke: false,
      //         fillOpacity: .7,
      //         fillColor: getColor(response.features[i].properties.mag),
      //         radius: circRad(response.features[i].properties.mag)
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  }).addTo(myMap)
})


var boundariesURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

d3.json(boundariesURL, function (response) {
  function polystyle(feature) {
    return {
      fillColor: 'yellow',
      weight: 2,
      opacity: 1,
      color: 'orange', //Outline color
      fillOpacity: 0.7
    };
  }


  L.geoJSON(response, {
    style: polystyle
  }).addTo(myMap);

})


// console.log(earthquakes)
//function createMap(earthquakes) {

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYmJhbGVzMTEiLCJhIjoiY2plYmptdmFwMGRydzJybzdpdzBxazk1aiJ9.ASSE0faIpkFAu87MR5RM0g");

var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYmJhbGVzMTEiLCJhIjoiY2plYmptdmFwMGRydzJybzdpdzBxazk1aiJ9.ASSE0faIpkFAu87MR5RM0g");

// var earthquakes = L.layerGroup(events).addTo(myMap);

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Dark Map": darkmap,
  "Street Map": streetmap,
  "Satellite Map": satmap
};

// Create overlay object to hold our overlay layer
var overlayMaps = {
  //Earthquakes: earthquakes
};



// // Create a legend to display information about our map
// var info = L.control({
//   position: "bottomright"
// });
// // When the layer control is added, insert a div with the class of "legend"
// info.onAdd = function() {
//   var div = L.DomUtil.create("div", "legend");
//   return div;
// };

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
//}

//Legend function based on documentation example code, modified as necessary for this data

var legend = L.control({
  position: 'bottomright'
});

function getColor(d) {
  return d <= 1 ? "#2ECC71" :
    d <= 2 ? "#F9E79F" :
    d <= 3 ? "#F1C40F" :
    d <= 4 ? "#fd8d3c" :
    d <= 5 ? "#F39C12" :
    d > 5 ? "#E74C3C" :
    "#ffffff";
};


legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(myMap);