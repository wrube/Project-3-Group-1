
// Filter sample names based on country
let sampleNames = decisions.filter(number => number.coa_iso == "AUS");


// Initialise the scatter plot
line_chart(dropdownCooTab3.property("value"))
// Call dropdown_menu function to populate dropdown menu
// dropdown_menu()


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
function line_chart(x, width, height){

 // Filter sampleNames based on selected country
    let newArray = sampleNames.filter(number => number.coo_name == x);

    // console.log(newArray)


    let years_list = []
    let refugees_list = []
    let recognized_list = []
    let other_list = []
    let closed_list = [];
    let rejected_list = []
    
// Extract years and total refugees for the selected country

    for (let i = 0; i < newArray.length; i++) {
      years_list.push(newArray[i]['year'])
      // refugees_list.push(newArray[i]['dec_total'])
    }
    // Remove duplicate years and sort
    let unique_years_list = (removeDuplicates(years_list));

    unique_years_list.sort((a, b) => {
      return new Date(a) - new Date(b)
    })


    // Iterate through unique_years_list
    unique_years_list.forEach((sample) => {
    let newyearsArray = newArray.filter(number => number.year == sample);
    let refugee_count = 0
    let recognized_count = 0
    let other_count = 0
    let closed_count = 0;
    let rejected_count = 0 

    // Calculate total refugees for the current year
    for (let i = 0; i < newyearsArray.length; i++) {
      refugee_count += (newyearsArray[i]['dec_total'])
      recognized_count += (newyearsArray[i]['dec_recognized']) 
      other_count += (newyearsArray[i]['dec_other'])
      closed_count += (newyearsArray[i]['dec_closed']);
      rejected_count += (newyearsArray[i]['dec_rejected'])
      
    }
    refugees_list.push(refugee_count)
    recognized_list.push(recognized_count) 
    other_list.push(other_count) 
    closed_list.push(closed_count);
    rejected_list.push(rejected_count)
  });


  // Data for Plotly line chart
    var line_data = [
      {
        x: unique_years_list,
        y: refugees_list,
        type: 'scatter',
        name: 'Total',
        line: {
          color: 'dodgerblue'
        } 
        
      },
      {
        x: unique_years_list,
        y: closed_list,
        type: 'scatter',
        name: 'Closed',
        line: {
          color: 'orange'
        } 
      },
      {
        x: unique_years_list,
        y: recognized_list,
        type: 'scatter',
        name: 'Recognized',
        line: {
          color: 'yellowgreen'
        } 
      },
      {
        x: unique_years_list,
        y: other_list,
        type: 'scatter',
        name: 'Other',
        line: {
          color: 'grey'
        } 
      },
      {
        x: unique_years_list,
        y: rejected_list,
        type: 'scatter',
        name: 'Rejected',
        line: {
          color: 'red'
        } 
      }
      
    ];

    var layout = {
      xaxis: {
        title: 'Year', 
        // type: 'category',
        range: [2007, 2023]
      },
      yaxis: {
        title: 'Number of Asylum Seeker Decisions'
      },
      width: 520, // Set the width
      height: 300 // Set the height
    };

   // Generate graph1
    Plotly.newPlot('graph1', line_data, layout);


}

