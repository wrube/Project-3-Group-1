const uniqueCOOs = extractUniqueValuePairs(decisions, 'coo_iso', 'coo_name')
const uniqueCOAs = extractUniqueValuePairs(decisions, 'coa_iso', 'coa_name')

const countryNames = {
    coo: Object.values(uniqueCOOs).sort(),
    coa: Object.values(uniqueCOAs).sort()
}


// select dropdown objects
const dropdownCooTab3 = d3.select("#selCOOdropdown");
const dropdownCountryTypeTab4 = d3.select("#selCountryType");
const dropdownCountryTab4 = d3.select("#selCountryOfInterest")

populateDropdown(countryNames.coo, dropdownCooTab3);

// populate Tab 4 dropdowns
const initCountryType = dropdownCountryTypeTab4.property("value");
populateDropdown(countryNames[initCountryType], dropdownCountryTab4);

// Event listener for country type
dropdownCountryTypeTab4.on("change", function() {
    let countryType = d3.select(this).property("value");
    populateDropdown(countryNames[countryType], dropdownCountryTab4);
  });




