let coo="Afghanistan"
let dec_closed=0
let dec_other=0
let dec_recognized=0
let dec_rejected=0
let values = [155,0,13762,3368]
let labels=['dec_closed','dec_other','dec_recognized','dec_rejected']
function init() {
    let data = [{
      values: values,
      labels: labels,
      type: "pie"
    }];
  
    let layout = {
      height: 600,
      width: 800
    };
  
    Plotly.newPlot("pie", data, layout);
}
d3.selectAll("#selDataset").on("change", getData); 
function getData(){
let data=[]
let dropdownMenu = d3.select("#selDataset");
let coo = dropdownMenu.property("value");
for (let i=0;i<decisions.length;i++){
    if(decisions[i].coo_name==coo && decisions[i].coa_name=="Australia"){
        dec_closed+=decisions[i].dec_closed
        dec_other+=decisions[i].dec_other
        dec_recognized+=decisions[i].dec_recognized
        dec_rejected+=decisions[i].dec_rejected
    }
}
values=[dec_closed,dec_other,dec_recognized,dec_rejected]
updatePlotly(data);
}
function updatePlotly(newdata) {
    Plotly.restyle("pie", "values", [newdata]);
}
init();
