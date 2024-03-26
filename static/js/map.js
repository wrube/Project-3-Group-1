// d3.json('data/asylum_decisions_2008-2023.json')

const COA = "AUS";
const decisionsCOAfiltered = filterByAttribute(decisions, "coa_iso", COA);


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

// const decisionLayers = ;

for (const key in decisionsObject) {
    if (Object.hasOwnProperty.call(decisionsObject, key)) {
        const dec = decisionsObject[key];
        dec["layer"] = country_layer(countries, decisionsCOAfiltered, dec.attributeKey);
        dec["legend"] = createLegend(dec.layer, dec.title);

    }
}

createMap(decisionsObject);


function filterByAttribute(data, attribute, value) {
    return data.filter(item => item[attribute] == value);
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

function addDecisionTotalToCountry(geoJSON, decisionList, decisionType) {
    const data = geoJSON.features;
    const modifiedCountries = [];
    const logString = `log10_${decisionType}`;
    

    data.forEach(country => {

        const countryISO3 = country.properties.ISO_A3;
        // create a filtered of countries list by the current country feature
        const countryDecision = filterByAttribute(decisionList, "coo_iso", countryISO3);
        const totalDecision = sumDecision(countryDecision, decisionType);

        country.properties[decisionType] = totalDecision;
        country.properties[logString] = log10(totalDecision);

        modifiedCountries.push(country);

      }
    );
    geoJSON.features = modifiedCountries;
    return geoJSON
}


function country_layer(geoJSON, decisionList, decisionType) {    
    const c = addDecisionTotalToCountry(geoJSON, decisionList, decisionType);

    console.log(decisionType);


    const cLayer = L.choropleth(c, {

        // Define which property in the features to use.
        // valueProperty: `log10_${decisionType}`,
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
        let logString = `log10_${decisionType}`
          layer.bindPopup(`<b>${feature.properties['ADMIN']}</b>
          <br>
          Total ${decisionType}: ${feature.properties[decisionType]}
            `);
        }
      })
    return cLayer
}


function createMap(inputs) {

    // Create the base layers.
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
  
    // Create a baseMaps object.
    let baseMaps = {
      "Base Map": base,
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {};
    for (const key in inputs) {
        if (Object.hasOwnProperty.call(inputs, key)) {
            const layer = inputs[key];
            overlayMaps[key] = layer.layer
            
        }
    }

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let map = L.map("map", {
      center: [
        -25, 125
      ],
      zoom: 2,
      layers: [base]
    });

    // const legend_1 = createLegend(inputs);
    // legend_1.addTo(myMap);

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
    })

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
}

function log10(number) {
    if (number == 0) {
        return 0
    } else {
        resultBase10Log = Math.log(number) / Math.log(10)
        return resultBase10Log;
    }

}
function createLegend (choroplethLayer, title) {
     // Add legend (don't forget to add the CSS from index.html)
    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        console.log("choropleth Layer: ", choroplethLayer);
        var limits = choroplethLayer.options.limits
        console.log(limits)
        var colors = choroplethLayer.options.colors
        var labels = []

        // Add min & max

        div.innerHTML = `<div class="legendTitle"><h4>${title}</h4> </div>
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


