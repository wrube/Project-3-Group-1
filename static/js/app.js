const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

let sampleNames = decisions.filter(number => number.coa_iso == "AUS");
function dropdown_menu(){
 // d3.json(url).then(function(samples) {
    let selector = d3.select("#selDataset");
    
    let countries_list = []

    for (let i = 0; i < sampleNames.length; i++) {
      countries_list.push(sampleNames[i]['coo_name'])
    }
 console.log(countries_list)
 
countries_list = (removeDuplicates(countries_list));
console.log(countries_list)

countries_list = countries_list.sort()


            
    countries_list.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });
   
    line_chart(countries_list[0])



 // })
}
dropdown_menu()



function optionChanged(x){

  line_chart(x)

}

function removeDuplicates(arr) {
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
}

function line_chart(x){
  // d3.json(url).then(function(samples_data) {
    // let sampleNames = samples_data.samples;
    let newArray = sampleNames.filter(number => number.coo_name == x);
    console.log(newArray)
    let years_list = []
    let refugees_list = []
    for (let i = 0; i < newArray.length; i++) {
      years_list.push(newArray[i]['year'])
      // refugees_list.push(newArray[i]['dec_total'])
    }
    let unique_years_list = (removeDuplicates(years_list));
    console.log(unique_years_list)
    unique_years_list.sort((a, b) => {
      return new Date(a) - new Date(b)
    })
    // console.log(unique_years_list)

    unique_years_list.forEach((sample) => {
    let newyearsArray = newArray.filter(number => number.year == sample);
    let refugee_count = 0
    // console.log(newyearsArray)

    for (let i = 0; i < newyearsArray.length; i++) {
      refugee_count += (newyearsArray[i]['dec_total'])
      // refugees_list.push(newArray[i]['dec_total'])
    }
    refugees_list.push(refugee_count)






  });
 




    var line_data = [
      {
        x: unique_years_list,
        y: refugees_list,
        type: 'scatter'
      }
    ];
    
    Plotly.newPlot('line', line_data);


   
            
  // })
}

