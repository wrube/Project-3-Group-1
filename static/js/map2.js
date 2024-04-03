let map2 = initiateMap("map2");

let countryIsCoaMap2;
let uniqueCountryNames;
if (initCountryType === 'coa') {
    countryIsCoaMap2 = true;
    uniqueCountryNames = uniqueCOAs;
} else {
    countryIsCoaMap2 = false;
    uniqueCountryNames = uniqueCOOs;
}

// set the country name and coa or coo boolean type
const countryTypeTab4 = dropdownCountryTypeTab4.property("value");
const countryTab4 = dropdownCountryTab4.property("value");
const ISO3nameTab4 = findKeyByValue(uniqueCountryNames, countryTab4);

// create basemap
let baseMap2 = createBaseMap(map2);


// create layers
let layersContainer2 = generateLayers(ISO3nameTab4, countryIsCoaMap2);
let overlays2 = createOverlay(layersContainer2);


//set starting layer
layersContainer2.Recognised.layer.addTo(map2);
layersContainer2.Recognised.legend.addTo(map2);

// create legend control
let layerControl2 = createLayerControl(baseMap2, overlays2);
layerControl2.addTo(map2);

toggleLegends(layersContainer2, map2);

let initOutline_tab4 = countryOutline(ISO3nameTab4);
countryDisplay_map2 = countryLayer(initOutline_tab4);
countryDisplay_map2.addTo(map2);

// keep outline on top of all layers
map2.on('overlayadd', function () {
    countryDisplay_map2.bringToFront(map2);
    });

// calculate and display the country centroid
let countryCentroidMap2 = L.geoJSON(turf.centroid(initOutline_tab4));
countryCentroidMap2.addTo(map2);

// listen to the tab4 country dropdown
dropdownCountryTab4.on("change", function() {
    // clear previous map
    if (map2 && map2.remove) {
        map2.off();
        map2.remove();
      }
   
    // reinitialise map2
    map2 = initiateMap("map2");

    // create basemap
    baseMap2 = createBaseMap(map2);

    // set the new country name and coa or coo boolean type
    const countryType = dropdownCountryTypeTab4.property("value");
    const countryName = d3.select(this).property("value");  
    let ISO3;
    let isCOA_map2 = true;
    console.log(countryType);
    if (countryType === 'coo' ) {
        ISO3 = findKeyByValue(uniqueCOOs, countryName);
        isCOA_map2 = false;
    }
    else {
        ISO3 = findKeyByValue(uniqueCOAs, countryName);
    }

    // setup new layers and control
    layersContainer2 = generateLayers(ISO3, isCOA_map2);
    overlays2 = createOverlay(layersContainer2);

    layerControl2 = createLayerControl(baseMap2, overlays2);
    layerControl2.addTo(map2);
    
    toggleLegends(layersContainer2, map2);
    
    initOutline_tab4 = countryOutline(ISO3);
    countryDisplay_map2 = countryLayer(initOutline_tab4);
    countryDisplay_map2.addTo(map2);

    // keep outline on top of all layers
    map2.on('overlayadd', function () {
        countryDisplay_map2.bringToFront(map2);
        });

    // calculate and display the country centroid
    countryCentroidMap2 = L.geoJSON(turf.centroid(initOutline_tab4));
    countryCentroidMap2.addTo(map2);

});