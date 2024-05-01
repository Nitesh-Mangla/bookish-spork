const env = require('dotenv')
const mongoose = require('mongoose');
const Log = require("./logsCreation");
const util = require("util");
env.config()

const mongo = () => {
    try {
        const url = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`;
        console.log(url)
        mongoose.connect(url);
        const dbConnection = mongoose.connection;
        dbConnection.on("connected", () => {
            console.log(`Mongo Database connected: ${url}`);
        });


        dbConnection.on("error", (err) => {
            Log('warning','database_connection', util.inspect(err, {depth: null}), "Failed to connect with mongo\n")
        });
        return dbConnection
    } catch (err) {
        Log('error','database_connection', util.inspect(err, {depth: null}), "Failed to connect with mongo\n")
    }
}

module.exports = mongo