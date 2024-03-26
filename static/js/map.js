// d3.json('data/asylum_decisions_2008-2023.json')

const COA = "AUS";
const decisionsCOAfiltered = filterByAttribute(decisions, "coa_iso", COA);


const decisionObject = {
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
}

// const decisionLayers = ;

for (const key in decisionObject) {
    if (Object.hasOwnProperty.call(decisionObject, key)) {
        const decision = decisionObject[key];
        const decisionLayer = 
        
    }
}

const cl = country_layer(countries, decisionsCOAfiltered, "dec_recognized");

createMap(cl);


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

    console.log(c);

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
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Input: inputs
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        -25, 125
      ],
      zoom: 2,
      layers: [street, inputs]
    });

    const legend_1 = createLegend(inputs);
    legend_1.addTo(myMap);


    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
}

function log10(number) {
    if (number == 0) {
        return 0
    } else {
        resultBase10Log = Math.log(number) / Math.log(10)
        return resultBase10Log;
    }

}
function createLegend (choroplethLayer) {
     // Add legend (don't forget to add the CSS from index.html)
    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = choroplethLayer.options.limits
        console.log(limits)
        var colors = choroplethLayer.options.colors
        var labels = []

        // Add min & max
        div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
                <div class="max">' + limits[limits.length - 1] + '</div></div>'

        limits.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + '"></li>')
        })

        div.innerHTML += '<ul>' + labels.join('') + '</ul>'
        return div
    }
    return legend;
}


function getColour(decisionType) {
    if (decisionType == "dec_rejected") {
        return ['lightgrey', '#a6611a','#dfc27d','yellow','#80cdc1','#018571'];
    } else if (decisionType == "dec_recognized") {
        // return ['lightgrey', '#a6611a','#dfc27d','yellow','#80cdc1','#018571'];
        return ['lightgrey', '#a6611a','orange', '#018571'];

    }
}


