const { MongoClient } = require('mongodb');

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    // const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/<database_name>?retryWrites=true&w=majority";
    const uri = "mongodb://localhost:27017"

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        test = await  findOneCountry(client, "AUS");
        console.log(test);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function findOneCountry(client, countryISO3) {
    result = await client.db("project3").collection("countries").findOne({'properties.ISO_A3': countryISO3});

    if (result) {
        console.log(`Found a country in the collection with the country ISOA3 ${countryISO3}`);
    } else {
        console.log(`No country found with the name ${countryISO3}`);
    }
    
    return result;
}




async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

main().catch(console.error);