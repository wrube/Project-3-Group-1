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

toggleLegends(layersContainer1);

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