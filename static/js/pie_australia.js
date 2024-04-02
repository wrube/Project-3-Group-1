let values = [155,0,13762,3368]
let labels=['closed','other','recognized','rejected']
function init() {
    let data = [{
      values: values,
      labels: labels,
      type: "pie"
    }];
  
    let layout = {
      height: 400,
      width: 550
    };
  
    Plotly.newPlot("graph2", data, layout);
  };
for(let j=0; j<1000;j++){
  var el = document.createElement("option");
  el.text = decisions[j].coo_name;
  el.value = decisions[j].coo_name;
  var select = document.getElementById("selDataset");
  select.appendChild(el);
  };
  
d3.selectAll("#selDataset").on("change", getData); 
function getData(){
let data=[]
let coo="Afghanistan"
let dec_closed=0
let dec_other=0
let dec_recognized=0
let dec_rejected=0
let dropdownMenu = d3.select("#selDataset");
 coo = dropdownMenu.property("value");
for (let i=0;i<1000;i++){
    if(decisions[i].coo_name==coo && decisions[i].coa_name=="Australia"){
        dec_closed+=decisions[i].dec_closed
        dec_other+=decisions[i].dec_other
        dec_recognized+=decisions[i].dec_recognized
        dec_rejected+=decisions[i].dec_rejected
    }
}
data=[dec_closed,dec_other,dec_recognized,dec_rejected]
updatePlotly(data);
}
function updatePlotly(newdata) {
    Plotly.restyle("graph2", "values", [newdata]);
}
init();
