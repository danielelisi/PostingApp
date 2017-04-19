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
        resp.sendFile(publicFolder + "/index.html");
    }
});

app.get("/posts", function (req, resp) {
    if (req.session.user) {
        resp.sendFile(publicFolder + "/posts.html");
    } else {
        resp.sendFile(publicFolder + "/index.html");
    }
});


// Async requests for index
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

            console.log(result.rows[0]);

            if (result.rows[0] == undefined) {

                resp.send({status: "fail", msg: "username/password match not valid"});
            } else {

                var userObj = {
                    id: result.rows[0].id,
                    username: result.rows[0].username
                }

                req.session.user = userObj;
                resp.send({status: "success"});
            }
        })
    });
});


// Async requests for Posts
app.post("/posts/create", function(req, resp) {
    pg.connect(dbURL, function(err, client, done){
        if(err) {
            console.log(err);
        }

        client.query("INSERT INTO posts (user_id, title, description) VALUES ($1,$2,$3) RETURNING time_created", [req.session.user.id, req.body.title, req.body.desc], function(err, result) {
            done();
            if(err) {
                console.log(err);
            }

            console.log(result.rows);

            if (result.rows.length > 0) {
                var postObj = {
                    username: req.session.user.username,
                    time: result.rows[0].time_created,
                    msg: "Post Created!"
                };

                resp.send(postObj);
            } else {
                resp.send({msg: "Error, Try Again"});
            }
        });
    });
});

app.get("/post/load", function(req, resp) {
    pg.connect(dbURL, function(err, client, done) {
        if(err) {
            console.log(err);
        }

        client.query("SELECT * FROM posts", [], function(err, result) {
            if(err) {
                console.log(err);
            }

            console.log(result.rows);
            done();
        });
    });
});



// Server initialization
server.listen(port, function(err) {
    if(err) {
        console.log(err);
    }

    console.log("Server running on port: " + port);
});