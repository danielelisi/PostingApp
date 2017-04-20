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
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: "danielesimpleposting",
    resave: true,
    saveUninitialized: true
}));


// Routing
app.get("/", function (req, resp) {
    if (req.session.user) {
        resp.sendFile(publicFolder + "/postsList.html");
    } else {
        resp.sendFile(publicFolder + "/index.html");
    }
});

app.get("/posts", function (req, resp) {
    if (req.session.user) {
        resp.sendFile(publicFolder + "/postsList.html");
    } else {
        resp.sendFile(publicFolder + "/index.html");
    }
});

app.get("/posts/:postindex", function (req, resp) {

    if (req.session.user) {

        req.session.user.postId = req.params.postindex;
        resp.sendFile(publicFolder + "/post.html");

    } else {
        resp.sendFile(publicFolder + "/index.html");
    }
});

app.get("/chatroom/:chatindex", function (req, resp) {

    var username

    if (req.session.user) {

        req.session.user.postId = req.params.chatindex;
        resp.sendFile(publicFolder + "/chatroom.html");

    } else {
        resp.sendFile(publicFolder + "/index.html")
    }

});

// Logout
app.post("/logout", function(req,resp) {
    req.session.destroy();
    resp.send("success");
});


// Async requests for index
app.post("/user/register", function (req, resp) {
    pg.connect(dbURL, function (err, client, done) {
        if (err) {
            console.log(err);
        }

        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;

        var dbQuery = "INSERT INTO users (username, email, password) VALUES ($1,$2,$3)";
        client.query(dbQuery, [username, email, password], function (err) {
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
    pg.connect(dbURL, function (err, client, done) {
        if (err) {
            console.log(err);
        }

        var email = req.body.email;
        var password = req.body.password;

        var dbQuery = "SELECT id, username FROM users WHERE email = $1 AND password = $2";
        client.query(dbQuery, [email, password], function (err, result) {
            done();
            if (err) {
                console.log(err);
            }

            if (result.rows[0] === undefined) {

                resp.send({status: "fail", msg: "username/password match not valid"});

            } else {

                req.session.user = {
                    id: result.rows[0].id,
                    username: result.rows[0].username
                };
                resp.send({status: "success"});
            }
        })
    });
});


// Async Posts CRUD
app.post("/postCRUD", function (req, resp) {

    if (req.body.status === "create") {
        pg.connect(dbURL, function (err, client, done) {
            if (err) {
                console.log(err);
            }

            var dbQuery = "INSERT INTO posts (user_id, title, description) " +
                "VALUES ($1,$2,$3) " +
                "RETURNING time_created, id";
            client.query(dbQuery, [req.session.user.id, req.body.title, req.body.desc], function (err, result) {
                done();
                if (err) {
                    console.log(err);
                }

                if (result.rows.length > 0) {
                    var postObj = {
                        username: req.session.user.username,
                        time: result.rows[0].time_created,
                        postId: result.rows[0].id,
                        msg: "Post Created!"
                    };
                    resp.send(postObj);

                } else {
                    resp.send({msg: "Error, Try Again"});
                }
            });
        });

    } else if (req.body.status === "read") {

        pg.connect(dbURL, function (err, client, done) {
            if (err) {
                console.log(err);
            }

            // retrieve id to be assign to newDiv client side
            var dbQuery = "SELECT posts.id, title, description, users.username, time_created " +
                "FROM posts " +
                "INNER JOIN users ON posts.user_id = users.id " +
                "ORDER BY posts.id DESC";
            client.query(dbQuery, [], function (err, result) {
                done();
                if (err) {
                    console.log(err);
                }

                resp.send(result.rows);
            });
        });
    }
});

// Async Replies CRUD
app.post("/repliesCRUD", function(req, resp) {

    if (req.body.status === "create") {

        pg.connect(dbURL, function(err, client, done) {
            if(err) {
                console.log(err);
            }

            client.query("INSERT INTO replies (post_id, reply) VALUES ($1, $2) RETURNING time_created", [req.session.user.postId, req.session.user.username + ": > " + req.body.reply], function (err, result){
               done();
               if(err){
                   console.log(err);
               }

               resp.send({status:"success",
                   username: req.session.user.username,
                   replyMsg: req.body.reply,
                   time: result.rows[0].time_created});

            });
        });
    }
    else if (req.body.status === "read") {

        pg.connect(dbURL, function (err, client, done) {
            if(err){
                console.log(err);
            }

            var dbQuery = "SELECT * FROM replies WHERE post_id = $1";
            client.query(dbQuery, [req.session.user.postId], function(err, result) {
                done();
                if(err){
                    console.log(err);
                }

                if (result.rows.length > 0){

                    resp.send({status: "success", replies: result.rows});

                } else {
                    resp.send({msg: "No replies in this post"});
                }
            });
        });
    }
    else if (req.body.status === "update") {

    }
    else if (req.body.status === "delete") {

    }
});


// Server initialization
server.listen(port, function (err) {
    if (err) {
        console.log(err);
    }

    console.log("Server running on port: " + port);
});