const coa = "AUS"
console.log(decisions)

// Filter the dataset for Australia (coa_iso: "AUS")
var australiaData = decisions.filter(function(item) {
    return item.coa_iso === "AUS";
  });

  // Years and total decisions
  var years = australiaData.map(function(item) {
    return item.year;
  });

  var totalDecisions = australiaData.map(function(item) {
    return item.dec_total;
  });

  // Create trace for the line graph
  var trace = {
    x: years,
    y: totalDecisions,
    // mode: 'line',
    type: 'scatter',
    name: 'Total Decisions by Australia for Asylum Seekers'
  };

  // Layout
  var layout = {
    title: 'Total Asylum Decisions by Australia for Asylum Seekers over Time',
    xaxis: {
      title: 'Year'
    },
    yaxis: {
      title: 'Total Decisions'
    }
  };

  // Plot
  Plotly.newPlot('chart', [trace], layout);


