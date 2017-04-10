/**
 * Created by danielelisi on 2017-04-09.
 */

const port = process.env.PORT || 3000;
const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const pg = require("pg");

var app = express();
const server = require("http").createServer(app);
var io = require("socket.io")(server);

// Path resolver
var publicFolder = path.resolve(__dirname, "view");
var dbURL = process.env.DATABASE_URL || "postgres://localhost:5432/postingapp";

// Modules configurations
app.use("/scripts", express.static("build"));
app.use("/style", express.static("stylesheet"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: "danielesimpleposting",
    resave: true,
    saveUninitialized: true
}));


// Routing
app.get("/", function (req, resp) {

    resp.end("Welcome to Simple Posting App");
});



// Server initialization
server.listen(port, function(err) {
    if(err) {
        console.log(err);
    }

    console.log("Server running on port: " + port);
});