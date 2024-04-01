const countryOfInterest = "AUS";
const mapInitiated = false;
let map1;

// Initialize the map
if (!mapInitiated);{
    map1 = initiateMap("map1");
}


// create basemap
let baseMap1 = createBaseMap(map1);
// baseMap.addTo(map);

// create layers
let layersContainer1 = generateLayers(countryOfInterest, true);
let overlays1 = createOverlay(layersContainer1);

//set starting layer
layersContainer1.Recognised.layer.addTo(map1);
layersContainer1.Recognised.legend.addTo(map1);

// create legend control
let layerControl1 = createLayerControl(baseMap1, overlays1);
layerControl1.addTo(map1);

toggleLegends(layersContainer1, map1);

//listener to the COO dropdown
let countryDisplay;
let countryCentroid;
dropdownCoaTab3.on("change", function() {

    if (countryDisplay) {
        map1.removeLayer(countryDisplay);
        map1.removeLayer(countryCentroid);
    }
    const countryName = d3.select(this).property("value");
    const ISO3name = findKeyByValue(uniqueCOOs, countryName);
    filteredCountry = countries.features.filter(feature => {
        return feature.properties.ISO_A3 === ISO3name
        })

    countryDisplay = L.geoJSON(filteredCountry[0], {
        style: {
            // Border colour
            color: "blue",
            weight: 2,
            fillOpacity: 0
          },
    });
    countryDisplay.addTo(map1);

    map1.on('overlayadd', function() {
        countryDisplay.bringToFront();
    });
    // find centroid
    console.log(filteredCountry);
    countryCentroid = L.geoJSON(turf.centroid(filteredCountry[0]));
    countryCentroid.addTo(map1);


    console.log(countryCentroid);
    }
);









//----------------------------------------------
// // create legend control array;
// let legendControlArray = [];
// for (const dec in layersContainer) {
//     if (Object.hasOwnProperty.call(layersContainer, dec)) {
//         const legend = layersContainer[dec]['legend'];
//         legendControlArray.push(legend);
//     }
// }


// console.log("Layer container: ", legendControlArray);

// legendControlArray.forEach(legend => {
//     map.removeControl(legend);
// });
// console.log("Layer container: ", legendControlArray);

// // Function to remove existing controls
// function removeExistingControls() {
//   // Your code to remove existing Leaflet controls
// }

// // Function to update map based on dropdown selection
// function updateMap(selectedOption) {
//   removeExistingControls();
//   // Your code to update the map based on selected option
//   // For example, add new layers, markers, controls, etc.
// }

// // Add event listener to dropdown menu
// d3.select("#data-select").on("change", function() {
//   var selectedOption = d3.select(this).property("value");
//   updateMap(selectedOption);
// });

// // Initialize map with default data
// var initialOption = d3.select("#data-select").property("value");
// updateMap(initialOption);

// generateLayersAndMap(countryOfInterest, true);