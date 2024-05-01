const express = require("express");
const app = express();
const routes = require('./routes.js');
const mongo = require('./config/MongooseConnection')
mongo()
app.use("/", routes);
app.listen(3004, () => {
    console.log("Node server start")
})