/**
 * Create a leaflet map object to place in the html.
 * 
 * 
 * @param {string} htmlElement name of html element to place map
 * @returns 
 */
function initiateMap(htmlElement) { 
    // Create our map, 
    let map = L.map(htmlElement, {
        center: [
            10, 20
        ],
        zoom: 2,
        });

    return map;
}


/**
 * Creates and returns a Leaflet baseMap for input into control.
 * 
 * @returns Basemaps object for input into control
 */
function createBaseMap(map) {
    var attribution = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    const base = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {attribution: attribution}
    ).addTo(map);

    var baseLayers = {
        'Base Map': base,
    }
    return baseLayers;
}


function createLayerControl(baseMap, overlays){
    // Add the layer control to the map.
    control = L.control.activeLayers(baseMap, overlays, {
        collapsed: false
        }
    );    
    return control;
}

/**
 * Generates an object that contains all the layer meta-information and layer objects and colorbars
 * @param {string} countryOfInterest ISO3 name of country of interest
 * @param {boolean} countryIsCOA true or false
 * @returns object with the different decision outcomes as keys with objects including the
 * 
 */
function generateLayers(countryOfInterest, countryIsCOA){
    const decisionsFiltered = filterByAttribute(decisions, countryIsCOA, countryOfInterest);

    // create an object that contains all the decision options and titles for map generation
    const decisionsObject = {
        Recognised: {attributeKey: "dec_recognized",
                    title: "Total Asylum Seekers Recognised 2008-2023"
                    },
        Other: {attributeKey: "dec_other",
                    title: "Total 'Other' Decisions  2008-2023"
        },
        Rejected: {attributeKey: "dec_rejected",
                    title: "Total Asylum Seekers Rejected 2008-2023"
        },
        Closed: {attributeKey: "dec_closed",
                    title: "Total Closed Decisions 2008-2023"
        },
        Total: {attributeKey: "dec_total",
                    title: "Total Applications 2008-2023"
        },
    }

    for (const key in decisionsObject) {
        if (Object.hasOwnProperty.call(decisionsObject, key)) {
            const dec = decisionsObject[key];
            dec["layer"] = country_layer(countries, decisionsFiltered, dec.attributeKey, countryIsCOA);
            dec["legend"] = createLegend(dec.layer, dec.title);

        }
    }
    return decisionsObject;
    // createMap(decisionsObject);
}

/**
 * Returns the decisions of countries dependent on whether the country is a COO or COA and the country
 * ISO3 name.
 * 
 * @param {object} data Decision dataset provided by UNHRC
 * @param {boolean} countryIsCOA true or false
 * @param {string} countryName ISO3 name of country
 * @returns filtered decision array specific to the filter value
 */
function filterByAttribute(data, countryIsCOA, countryName) {
    if (countryIsCOA == true) {
        return data.filter(item => item["coa_iso"] == countryName)
    } else {
        return data.filter(item => item["coo_iso"] == countryName)
    }
    ;
  }

function sumDecision(decisionArray, decisionType) {
    let total = 0;
    if (decisionArray.length > 0) {
        for (let i = 0; i < decisionArray.length; i++) {
            const decision = decisionArray[i];
            total += decision[decisionType] 
        }
    }
    return total
}

function addDecisionTotalToCountry(geoJSON, decisionList, decisionType, countryIsCOA) {
    const data = geoJSON.features;
    const modifiedCountries = [];    

    data.forEach(country => {

        const countryISO3 = country.properties.ISO_A3;
        // create a filtered of countries list by the current country feature
        let countryDecision;
        if (countryIsCOA === true) {
            countryDecision = filterByAttribute(decisionList, false, countryISO3);
        } else {
            countryDecision = filterByAttribute(decisionList, true, countryISO3);
        }
        
        const totalDecision = sumDecision(countryDecision, decisionType);

        country.properties[decisionType] = totalDecision;

        modifiedCountries.push(country);

      }
    );
    geoJSON.features = modifiedCountries;
    return geoJSON
}


function country_layer(geoJSON, decisionList, decisionType, countryIsCOA) {    
    const c = addDecisionTotalToCountry(geoJSON, decisionList, decisionType, countryIsCOA);

    const cLayer = L.choropleth(c, {

        // Define which property in the features to use.
        valueProperty: decisionType,
    
        // Set the colour scale.
        scale: getColour(decisionType),
    
        // The number of breaks in the step range
        steps: 10,
    
        // q for quartile, e for equidistant, k for k-means
        mode: "e",
        style: {
          // Border colour
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8,
          opacity: 0.5
        },
    
        // Binding a popup to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup(`<b>${feature.properties['ADMIN']}</b>
          <br>
          Total ${decisionType}: ${feature.properties[decisionType]}
            `);
        }
      })
    return cLayer
}


/**
 * Creates overlay object for input into L.control.layers.
 * 
 * @param {object} inputs object outputted from generateLayers function
 * @returns Overlay object for input into L.control.layers
 */
function createOverlay(inputs) {
    // Create an overlay object to hold our overlay.
    let overlayMaps = {};
    for (const key in inputs) {
        if (Object.hasOwnProperty.call(inputs, key)) {
            const layer = inputs[key];
            overlayMaps[key] = layer.layer           
        }
    }
    return overlayMaps;
}


function toggleLegends(inputs, map){
     // add the relevent legend according to the selected overlay layer
     map.on('overlayadd', function (eventLayer) {
        if (eventLayer.name === 'Recognised') {         
            inputs.Recognised.legend.addTo(map);
        } else if (eventLayer.name === 'Other') { 
            inputs.Other.legend.addTo(map);
        } else if (eventLayer.name === 'Rejected') { 
            inputs.Rejected.legend.addTo(map);
        } else if (eventLayer.name === 'Closed') {
            inputs.Closed.legend.addTo(map);
        } else if (eventLayer.name === 'Total') {
            inputs.Total.legend.addTo(map);
            }
        }
    );


    // remove the relevent legend according to the deselected overlay layer
    map.on('overlayremove', function (eventLayer) {
        if (eventLayer.name === 'Recognised') {
            map.removeControl(inputs.Recognised.legend);           
        } else if (eventLayer.name === 'Other') { 
            map.removeControl(inputs.Other.legend);
        } else if (eventLayer.name === 'Rejected') { 
            map.removeControl(inputs.Rejected.legend);
        } else if (eventLayer.name === 'Closed') {
            map.removeControl(inputs.Closed.legend);
        } else if (eventLayer.name === 'Total') {
            map.removeControl(inputs.Total.legend);
        }
        }
    )
}


function createLegend (choroplethLayer, title) {
     // Add legend (don't forget to add the CSS from index.html)
    var legend = L.control({ position: 'bottomleft' })
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = choroplethLayer.options.limits
        var colors = choroplethLayer.options.colors
        var labels = []

        // Add min & max

        div.innerHTML = `<div class="legendTitle"><h7>${title}</h7> </div>
                        <br>
                        <div class="labels"><div class="min">  ${limits[0]}  </div> 
                        <div class="max"> ${limits[limits.length - 1]} </div></div>`

        limits.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + '"></li>')
        })

        div.innerHTML += '<ul>' + labels.join('') + '</ul>'
        return div
    }
    return legend;
}


function getColour(decisionType) {
    if (decisionType == "dec_rejected" || decisionType == "dec_closed") {
        return ['#fee5d9','#fcae91','#fb6a4a','#cb181d'];
    } else if (decisionType == "dec_recognized" ) {
        return ['#ffffcc','#c2e699','#78c679','#238443'];
    } else if (decisionType == "dec_total" ) {
        return ['#f0f9e8','#bae4bc','#7bccc4','#2b8cbe'];
    } else {
        return ['#f7f7f7','#cccccc','#969696','#525252'];
    }
}


/**
 * Populates the select tag in the html document.
 * 
 * @param {array} listOfOptions    list of options
 * @param {dropdown} dropdown  A d3 dropdown selection object 
 */
function populateDropdown(listOfOptions, dropdown) {
    // First, remove all existing options
    dropdown.selectAll('option').remove();
    // populate the dropdown
    dropdown.selectAll('option')
        .data(listOfOptions)
        .enter()
        .append('option')
        .text(d => d)
}

function extractUniqueValuePairs(list, ISOkey, nameKey) {
    let uniqueCountries = {};

    for (let i = 0; i < list.length; i++) {
        const dec = list[i];
        const ISO3 = dec[ISOkey];
        const country = dec[nameKey]
        if (!uniqueCountries.hasOwnProperty(ISO3)) {
            uniqueCountries[ISO3] = country
        }
    }
    return uniqueCountries;
}


function findKeyByValue(obj, value) {
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            if (obj[key] === value) {
                return key;
            }
        }
    }
    // If value is not found in the object
}

function countryOutline(countryName) {
    const filteredCountry = countries.features.filter(feature => {
        return feature.properties.ISO_A3 === countryName;
        })
    return filteredCountry[0];
}


function countryLayer(countryOutline) {
    const layer = L.geoJSON(countryOutline, {
        style: {
            // Border colour
            color: "black",
            weight: 2,
            fillOpacity: 0
          },
    });
    return layer
}

function updateMapOnChange(map, name) {

    const ISO3name = findKeyByValue(uniqueCOOs, name);

    const outline = countryOutline(ISO3name);
    let layer = countryLayer(outline);
    layer.addTo(map);    

    // keep outline on top of all layers
    map.on('overlayadd', function () {
        layer.bringToFront(map);
    });
    // calculate and display the country centroid
    let marker = L.geoJSON(turf.centroid(outline));
    marker.addTo(map);
    return {layer: layer,
            centroid: marker};

    }

    function addCentroid(COA, COO, countryOutline) {

        let filteredDecisions = filterByAttribute(filterByAttribute(decisions, true, COA), false, COO);

        let closed = sumDecision(filteredDecisions, 'dec_closed');
        let recognised = sumDecision(filteredDecisions, 'dec_recognized');
        let rejected = sumDecision(filteredDecisions, 'dec_rejected');
        let other = sumDecision(filteredDecisions, 'dec_other');
        let total = sumDecision(filteredDecisions, 'dec_total');
    
        let coords = turf.centroid(countryOutline);
    
        let marker = L.geoJSON(coords, {
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`
                            Recognised: ${recognised} <br>
                            Other: ${other} <br>
                            Rejected: ${rejected} <br>
                            Closed: ${closed} <br>
                            Total: ${total} 
                            `)
            }
        })
    
        return marker;
    }

    function addCentroid_map2(countryISO3, isCOA, countryOutline) {

        let filteredDecisions = filterByAttribute(decisions, isCOA, countryISO3);

        let closed = sumDecision(filteredDecisions, 'dec_closed');
        let recognised = sumDecision(filteredDecisions, 'dec_recognized');
        let rejected = sumDecision(filteredDecisions, 'dec_rejected');
        let other = sumDecision(filteredDecisions, 'dec_other');
        let total = sumDecision(filteredDecisions, 'dec_total');
    
        let coords = turf.centroid(countryOutline);
    
        let marker = L.geoJSON(coords, {
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`
                            Recognised: ${recognised} <br>
                            Other: ${other} <br>
                            Rejected: ${rejected} <br>
                            Closed: ${closed} <br>
                            Total: ${total} 
                            `)
            }
        })
    
        return marker;
    }

    function top5_map2(countryISO3, isCOA) {
        let countryTypeKey = 'coa_iso';
        if (isCOA) {
            countryTypeKey = 'coo_iso'
        }

        let filteredDecisions = filterByAttribute(decisions, isCOA, countryISO3);
        let countryBucket = {};
        filteredDecisions.forEach(decision => {
            if (!countryBucket.hasOwnProperty(decision[countryTypeKey])) {
                countryBucket[decision[countryTypeKey]] = {
                    recognised: decision['dec_recognized'],
                    total: decision['dec_total'],
                    rejected: decision['dec_rejected'],
                    other: decision['dec_other'],
                    closed: decision['dec_closed']

                }
            } 
            else {
                countryBucket[decision[countryTypeKey]]['recognised']+= decision['dec_recognized']
                countryBucket[decision[countryTypeKey]]['total'] += decision['dec_total']
                countryBucket[decision[countryTypeKey]]['rejected']+= decision['dec_rejected']
                countryBucket[decision[countryTypeKey]]['other'] += decision['dec_other']
                countryBucket[decision[countryTypeKey]]['closed'] += decision['dec_closed']
            }
            
        });
        // Convert the object into an array of key-value pairs
        const dataArray = Object.entries(countryBucket);

        // Sort the array based on the 'total' property of the nested objects
        const top5 = dataArray.sort((a, b) => b[1].total - a[1].total).slice(0,5);

        // Convert the sorted array back to an object
        // const top5 = Object.fromEntries(dataArray);
        return top5;

    }

    function plotTop5(input, countryKey) {

        let countries = [];
        let recognised = [];
        let rejected = [];
        let other = [];
        let closed = [];
    
        // Process input data
        input.forEach(country => {
            let countryID = country[0];
            let data = country[1];

            countries.push(countryKey[countryID]);
            recognised.push(data['recognised']);
            rejected.push(data['rejected']);
            other.push(data['other']);
            closed.push(data['closed']);
            
        });

        const traceRecognised = {
          x: countries,
          y: recognised,
          name: 'Recognised',
          type: 'bar',
          marker: { color: 'yellowgreen' }
        };
    
        const traceRejected = {
          x: countries,
          y: rejected,
          name: 'Rejected',
          type: 'bar',
          marker: { color: 'red' }
        };
    
        const traceOther = {
          x: countries,
          y: other,
          name: 'Other',
          type: 'bar',
          marker: { color: 'grey' }
        };
    
        const traceClosed = {
          x: countries,
          y: closed,
          name: 'Closed',
          type: 'bar',
          marker: { color: 'orange' }
        };
        console.log(countries,recognised)

        Plotly.newPlot('top5', [traceRecognised, traceRejected, traceOther, traceClosed], {
            title: 'Top 5 Countries By Total Decisions 2008-2023',
            barmode: 'stack'
            }
        );
}