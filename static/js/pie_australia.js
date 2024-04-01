let coo="Afghanistan"

function init() {
  let dec_closed = 0;
  let dec_other = 0;
  let dec_recognized = 0; 
  let dec_rejected=0
  let values = [155,0,13762,3368]
  let pieLabels=['Closed','Other','Recognised','Rejected'];

    let data = [{
      values: values,
      labels: pieLabels,
      type: "pie"
    }];
  
    let layout = {
      title: "Proportions of Decisions Types",
      height: 300,
      width: 520
    };
  
    Plotly.newPlot("graph2", data, layout);
}

function getData(){
  console.log("Hi")
    let data=[]
    let dec_closed=0
    let dec_other=0
    let dec_recognized=0
    let dec_rejected=0
    let dropdownMenu = d3.select("#selCOOdropdown");
    let coo = dropdownMenu.property("value");
    for (let i=0;i<decisions.length;i++){
        if(decisions[i].coo_name==coo && decisions[i].coa_name=="Australia"){
            dec_closed+=decisions[i].dec_closed
            dec_other+=decisions[i].dec_other
            dec_recognized+=decisions[i].dec_recognized
            dec_rejected+=decisions[i].dec_rejected
        }
    }
    values=[dec_closed, dec_other, dec_recognized, dec_rejected]
    updatePlotly(values);
}


function updatePlotly(newdata) {
    Plotly.restyle("graph2", "values", [newdata]);
}
init();
