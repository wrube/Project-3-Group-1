# Project-3-Group-1

## Source
UN Data
[Refugee Statistics](https://api.unhcr.org/docs/refugee-statistics.html#api-Default-countries)

-- Definitions for data
https://www.unhcr.org/refugee-statistics/methodology/data-content/
Need a polygon file for country borders

## Proposal

A website to allow users to interactively understand and analyse:
- asylum seekers dispcement
  -  internal
  -  external 
- application results
  - positive/negative/   
 

## Instructions on how to use and interact with the project

### Generate the datasets

Use the file [retrieve_view_data.ipynb](retrieve_view_data.ipynb) to download your own copy.

### Load JSON datasets to Mongo Database
Here we use a local Mongo No-SQL database.

1. Import the asylum-decision JSON dataset to local Mongo database called **project3** using the terminal with:
   
   `mongoimport --type json -d project3 -c asylum_decisions --jsonArray asylum_decisions_2008-2023.json`

2. Import the countries GeoJSON to the same database. To do this successfully, install **jq** and use the following terminal commands:

   `jq --compact-output ".features" countries.geojson > countries_compact.geojson`, then
   
   `mongoimport --type json -d project3 -c countries countries_compact.geojson`

### Allow Javascript to connect to MongoDB

To allow MongoDB to connect with Javascript, follow the tutorial at [Connect to a MongoDB Database Using Node.js](https://www.mongodb.com/developer/languages/javascript/node-connect-mongodb/).

html product with a map and a couple of graphs

Country of asylum -> dropdown
Country of origin -> html

## Ethical considerations made in the project
Ethical considerations on:
- Data gathering from UN
- Consumer of information


### Checklist for Ethically Using Data
Follow this checklist when collecting and analysing data:
1. Review your dataset for any personally identifiable information (PII). If it contains PII, remove it
or otherwise anonymise your dataset, and control who is able to access the data. Be aware that it's
almost impossible to truly anonymise a dataset, as anonymised datasets can frequently be linked with
other datasets to identify the people included within them.
2. Investigate how your dataset was collected. Ask yourself questions like the following: Did the people
whose information is represented in the data consent to being included in the dataset? Did they consent
to their information being used in this way? If you can't confirm consent, try finding a different data
source or contacting the people included to obtain informed consent. As you make decisions about your
work, be sure to consider how it may harm or benefit the people in the dataset or their relatives.
3. Think about who the people represented in your dataset are, and how they relate to the people
who your work is likely to impact. Consider questions such as the following: Are the people in your
dataset representative of the full population? Are they from different socioeconomic classes and racial
backgrounds? Are there different cultures represented? Make sure that you consider what types of
people may have been excluded from your dataset.


### Data protection

Before publishing any statistics on the refugee statistics website, UNHCR applies safeguards to protect confidentiality. Small numbers less than five are rounded to the nearest multiple of five. Additionally data relating to asylum decisions is rounded between five and ten.

Data between tables remains additive therefore the totals should be considered approximations.

References for the data source(s)

References for any code used that is not your own
