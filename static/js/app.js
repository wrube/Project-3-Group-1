// const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Filter sample names based on country
let sampleNames = decisions.filter(number => number.coa_iso == "AUS");

// Function dropdown menu
function dropdown_menu(){
    let selector = d3.select("#selDataset");
    
    let countries_list = []

    // Get country names from sampleNames
    for (let i = 0; i < sampleNames.length; i++) {
      countries_list.push(sampleNames[i]['coo_name'])
    }
//  console.log(countries_list)
 
  // Remove duplicates from countries_list
countries_list = (removeDuplicates(countries_list));
// console.log(countries_list)

// Sort countries_list alphabetically
countries_list = countries_list.sort()


   // Append options to dropdown menu          
    countries_list.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });

   // Display line chart for the first country in the list
    line_chart(countries_list[0])


}

// Call dropdown_menu function to populate dropdown menu
dropdown_menu()


// Function for dropdown  change
function optionChanged(x){

  line_chart(x)

}

// Function to remove duplicates from array
function removeDuplicates(arr) {
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
}

// Function to generate line chart for a specific country
function line_chart(x){

 // Filter sampleNames based on selected country
    let newArray = sampleNames.filter(number => number.coo_name == x);
    // console.log(newArray)


    let years_list = []
    let refugees_list = []
    let recognized_list = []
    let other_list = []
    let rejected_list = []
    
// Extract years and total refugees for the selected country

    for (let i = 0; i < newArray.length; i++) {
      years_list.push(newArray[i]['year'])
      // refugees_list.push(newArray[i]['dec_total'])
    }
    // Remove duplicate years and sort
    let unique_years_list = (removeDuplicates(years_list));
    // console.log(unique_years_list)
    unique_years_list.sort((a, b) => {
      return new Date(a) - new Date(b)
    })
    // console.log(unique_years_list)

    // Iterate through unique_years_list
    unique_years_list.forEach((sample) => {
    let newyearsArray = newArray.filter(number => number.year == sample);
    let refugee_count = 0
    let recognized_count = 0
    let other_count = 0
    let rejected_count = 0 
    // console.log(newyearsArray)

    // Calculate total refugees for the current year
    for (let i = 0; i < newyearsArray.length; i++) {
      refugee_count += (newyearsArray[i]['dec_total'])
      recognized_count += (newyearsArray[i]['dec_recognized']) 
      other_count += (newyearsArray[i]['dec_other']) 
      rejected_count += (newyearsArray[i]['dec_rejected'])
      
    }
    refugees_list.push(refugee_count)
    recognized_list.push(recognized_count) 
    other_list.push(other_count) 
    rejected_list.push(rejected_count)
  });
 
console.log

// Data for Plotly line chart
    var line_data = [
      {
        x: unique_years_list,
        y: refugees_list,
        type: 'scatter',
        name: 'Closed'
        
      },
      {
        x: unique_years_list,
        y: recognized_list,
        type: 'scatter',
        name: 'Recognized'
      },
      {
        x: unique_years_list,
        y: other_list,
        type: 'scatter',
        name: 'Other'
      },
      {
        x: unique_years_list,
        y: rejected_list,
        type: 'scatter',
        name: 'Rejected'
      }
    ];

    var layout = {
      xaxis: {
        title: 'Year', 
        type: 'category' 
      },
      yaxis: {
        title: 'Number of Asylum Seeker Decisions'
      }
    };

   // Generate graph1
    Plotly.newPlot('graph1', line_data, layout);


}

