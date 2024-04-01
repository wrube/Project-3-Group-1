const countryOfInterest = "AUS";
const map1Initiated = false;
let map1;

// Initialize the map
if (!map1Initiated);{
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


// Initialise the first country
let countryDisplay;
let countryCentroid;
const initCoo_tab3 = dropdownCooTab3.property("value");
const initISO3name_tab3 = findKeyByValue(uniqueCOOs, initCoo_tab3);
const initOutline_tab3 = countryOutline(initISO3name_tab3);
countryDisplay = countryLayer(initOutline_tab3);
countryDisplay.addTo(map1);

// keep outline on top of all layers
map1.on('overlayadd', function () {
    countryDisplay.bringToFront(map1);
    });

// calculate and display the country centroid
countryCentroid = L.geoJSON(turf.centroid(initOutline_tab3));
countryCentroid.addTo(map1);


// have a listener object on the coo dropdown and update country outlines and markers
dropdownCooTab3.on("change", function() {

    if (countryDisplay) {
        map1.removeLayer(countryDisplay);
        map1.removeLayer(countryCentroid);
    }
    const countryName = d3.select(this).property("value");
    const ISO3name = findKeyByValue(uniqueCOOs, countryName);

    const outline = countryOutline(ISO3name);
    countryDisplay = countryLayer(outline);
    countryDisplay.addTo(map1);

    // keep outline on top of all layers
    map1.on('overlayadd', function () {
        countryDisplay.bringToFront(map1);
    });

    // calculate and display the country centroid
    countryCentroid = L.geoJSON(turf.centroid(outline));
    countryCentroid.addTo(map1);

    }
);
