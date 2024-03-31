const countryOfInterest = "AUS";
const mapInitiated = false;
let map;

// Initialize the map
if (!mapInitiated);{
    map = initiateMap("map1");
}

// create basemap
baseMap = createBaseMap(map);
// baseMap.addTo(map);

// create layers
let layersContainer = generateLayers(countryOfInterest, true);
let overlays = createOverlay(layersContainer);

// create legend control
let layerControl = createLayerControl(baseMap, overlays);
layerControl.addTo(map);

toggleLegends(layersContainer);

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