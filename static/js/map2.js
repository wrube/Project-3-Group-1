let map2 = initiateMap("map2");

let countryIsCoaMap2;
if (initCountryType === 'coa') {
    countryIsCoaMap2 = true;
} else {
    countryIsCoaMap2 = false;
}

const countryTab4 = dropdownCountryTypeTab4.property("value");
const ISO3nameTab4 = findKeyByValue(countryNames[countryTab4], countryTab4);

// create basemap
let baseMap2 = createBaseMap(map2);


// create layers
console.log(ISO3nameTab4);
let layersContainer2 = generateLayers(countryTab4, countryIsCoaMap2);
let overlays2 = createOverlay(layersContainer2);


//set starting layer
layersContainer2.Recognised.layer.addTo(map2);
layersContainer2.Recognised.legend.addTo(map2);

// create legend control
let layerControl2 = createLayerControl(baseMap2, overlays2);
layerControl2.addTo(map2);

toggleLegends(layersContainer2, map2);

// listen to the tab4 country dropdown
dropdownCountryTab4.on("change", function() {
    


    const countryType = dropdownCountryTypeTab4.property("value");
    const countryName = d3.select(this).property("value");  
    console.log(countryNames[countryType]); 
    let ISO3;
    if (countryType === 'coo' ) {
        ISO3 = findKeyByValue(uniqueCOOs, countryName);
    }
    else {
        ISO3 = findKeyByValue(uniqueCOAs, countryName);
    }
    
    console.log("country Type: ", countryType, countryName, ISO3);

});