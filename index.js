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
    if (req.session.user) {
        resp.sendFile(publicFolder + "/posts.html");
    } else {
        resp.sendFile(publicFolder + "index.html");
    }
});

app.get("/posts", function (req, resp) {
    if (req.session.user) {
        resp.sendFile(publicFolder + "/posts.html");
    } else {
        resp.sendFile(publicFolder + "index.html");
    }
});


// Async requests for index.html
app.post("/user/register", function (req, resp) {

    pg.connect(dbURL, function(err, client, done) {
        if (err) {
            console.log(err);
        }

        client.query("INSERT INTO users (username, email, password) VALUES ($1,$2,$3)", [req.body.username, req.body.email, req.body.password], function (err) {
            done();
            if (err) {
                console.log(err);
                resp.send({status: "fail", msg: "Error in registration"});
            }

            resp.send({status: "success", msg: "User is registered"});
        });
    });
});

app.post("/user/login", function (req, resp) {

    pg.connect(dbURL, function(err, client, done) {
        if (err) {
            console.log(err);
        }

        client.query("SELECT id, username FROM users WHERE email = $1 AND password = $2", [req.body.email, req.body.password], function(err, result){
            done();
            if (err) {
                console.log(err);
                resp.send({status: "fail"});
            }

            req.session.user = {username: result.rows[0].username, id: result.rows[0].id};
            resp.send({status: "success"});
        })
    });
});



// Server initialization
server.listen(port, function(err) {
    if(err) {
        console.log(err);
    }

    console.log("Server running on port: " + port);
});