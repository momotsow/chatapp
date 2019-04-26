var express = require('express');
var http = require('http');
const mongo = require('mongodb').MongoClient;

var app = express();
var server = http.Server(app);
const io = require('socket.io')(server);
var users = []; // create a list named users

//connect to mongo
mongo.connect('mongodb://127.0.0.1/chatApp', function(err, db) {
    if(err) {
        throw err;
    }
    console.log('mongoDB connected...');
});

//link html file
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

//link css file
app.get("/style/index.css", function(req, res) {
    res.sendFile(__dirname + "/style/index.css");
});

//connect socket io to show connected
io.on("connection", function(socket) {
    var name = "";
    //connect socket io to show a connected user 
    socket.on("has connected", function(username){
        users.push(username);
        name = username;
        io.emit("has connected", {username: username, usersList: users});
        
    });
    //connect socket io to show disconnected when a user disconnnect
    socket.on("disconnect", function() {
      users.splice(users.indexOf(name), 1);
      io.emit("has disconnected", {username: name, usersList: users});
     });

     //messages
    socket.on("new message", function(data){
        io.emit("new message", data);

});

});

server.listen(4000, function(){
    console.log('Server running on port 4000');
});