// d3.json('data/asylum_decisions_2008-2023.json')

// const countryOfInterest = "AFG";


// generateLayersAndMap(countryOfInterest, false, map);


const uniqueCOOs = extractUniqueValuePairs(decisions, 'coo_iso', 'coo_name')
const uniqueCOAs = extractUniqueValuePairs(decisions, 'coa_iso', 'coa_name')

const countryNamesCOO = Object.values(uniqueCOOs).sort();

// select dropdown object
const CooDropdown = d3.select("#selCOOdropdown");

populateDropdown(countryNamesCOO, CooDropdown);

let activeCOA = CooDropdown.property("value");


let mapCOA;
let mapCOO;
let control;
let decisionsObject;
let mapInitiated = false;

// mapCOO = optionChangedCOO(activeCOA);


document.addEventListener("selCOOdropdown", function(event) {
    // Initialize the map
    let activeCOA = CooDropdown.property("value");

    if (!mapInitiated) {
        initiateMap()
    }

    generateLayersAndMap(ISO3name, true, mapCOO);

    initiateMap()


//     // Function to remove existing controls
//     function removeExistingControls() {
//       // Your code to remove existing Leaflet controls
//     }

//     // Function to update map based on dropdown selection
//     function updateMap(selectedOption) {
//       removeExistingControls();
//       // Your code to update the map based on selected option
//       // For example, add new layers, markers, controls, etc.
//     }

//     // Add event listener to dropdown menu
//     d3.select("#data-select").on("change", function() {
//       var selectedOption = d3.select(this).property("value");
//       updateMap(selectedOption);
//     });

//     // Initialize map with default data
//     var initialOption = d3.select("#data-select").property("value");
//     updateMap(initialOption);
  });




/**
 * 
 * @param {string} countryOfInterest ISO3 name of country of interest
 * @param {boolean} countryIsCOA Is the country of interest a COA?
 * @param {LeafletMap} map map object
 * @returns 
 */
function generateLayersAndMap(countryOfInterest, countryIsCOA, map){
    const decisionsFiltered = filterByAttribute(decisions, countryIsCOA, countryOfInterest);
    // console.log('mapCOO', map)

    // if (mapInitiated)  {
    //     map.removeControl(control);
    //     console.log('layer_control removed');

    //     // check for residual active layers and delete
    //     const overlayLayers = control.getActiveOverlayLayers();
    //         for (var overlayId in overlayLayers) {
    //             // console.log(overlayLayers[overlayId].name)
    //             map.removeLayer(overlayLayers[overlayId]);
    //             }


    //     for (const key in decisionsObject) {
    //         if (Object.hasOwnProperty.call(decisionsObject, key)) {
    //             const decisionObj = decisionsObject[key];
    //             // console.log(decisionObj.legend)
    //             map.removeControl(decisionObj.legend)
                
    //         }
    //     }
    // }
    decisionsObject = {};

    // create an object that contains all the decision options and titles for map generation
    decisionsObject = {
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
    // console.log(decisionsObject);

    return createMap(decisionsObject, map);
}

function initiateMap(mapDiv) { 
    // Create our map, 
    let map = L.map("map2", {
        center: [
            0, 90
        ],
        zoom: 2,
        // layers: [baseMap, layer]
        });

    return map;
}






function filterByAttribute(data, countryIsCOA, value) {
    if (countryIsCOA == true) {
        return data.filter(item => item["coa_iso"] == value)
    } else {
        return data.filter(item => item["coo_iso"] == value)
    }
    ;
  }



function optionChangedCOO(countryOfInterest) {
    
    const ISO3name = findKeyByValue(uniqueCOAs, countryOfInterest);
    console.log('active country', ISO3name);
    // use the global dataPromise to access data

    if (mapInitiated) {
        console.log(mapCOO);
        mapCOO.off();
        mapCOO.remove()
    }   
    return generateLayersAndMap(ISO3name, true, mapCOO);
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
          fillOpacity: 0.8
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


function createMap(inputs, map) {

    // clear the map if it exists
    // clearMap(map)

    // Create the base layers.
    
    


    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

  
    // Create a baseMaps object.
    const baseMaps = {
      "Base Map": base,
    };
  
    // Create an overlay object to hold our overlay.
    const Recognised = inputs.Recognised.layer;
    // const Other = inputs.Other.layer;
    // const Closed = inputs.Closed.layer;
    // const Rejected = inputs.Rejected.layer;
    // const Total = inputs.Total.layer;

    // console.log(typeof(Recognised))
    // let layersGroup = L.layerGroup();
    // layersGroup.addLayer(Recognised);
    // layersGroup.addLayer(Other);
    // layersGroup.addLayer(Closed);
    // layersGroup.addLayer(Rejected);
    // layersGroup.addLayer(Total);

    let overlayMaps = {};
    for (const key in inputs) {
        if (Object.hasOwnProperty.call(inputs, key)) {
            const layer = inputs[key];
            overlayMaps[key] = layer.layer
            
        }
    }
    map = initiateMap(base, Recognised)
    if (mapInitiated === false) {
        
        mapInitiated = true
    } 




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

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    // control = L.control.activeLayers(baseMaps, overlayMaps);
    // console.log(control)
    // control.addTo(map);

    // console.log(control.getActiveOverlayLayers())
    
    control = L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    return map;
}


function createLegend (choroplethLayer, title) {
     // Add legend (don't forget to add the CSS from index.html)
    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = choroplethLayer.options.limits
        var colors = choroplethLayer.options.colors
        var labels = []

        // Add title and min & max

        div.innerHTML = `
                        <div class="legendTitle"><h7>${title}</h7> </div>
                        <div class="labels"><div class="min">  ${limits[0]}  </div> 
                        <div class="max"> ${limits[limits.length - 1]} </div></div>`

        limits.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + '"></li>')
        })
        

        div.innerHTML += '<ul>' + labels.join('') + '</ul>'
        // console.log(div.innerHTML)
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
    return null; 
}
