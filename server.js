var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var express = require("express");

var users = 0;
var userdata = [];

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
	app.use(express.static(__dirname));
});

io.on("connection", function(socket) {
	socket.on("chat message", function(msg) {
		io.emit("chat message", socket.chat + ": " + socket.username + ": " + msg);
		console.log(socket.chat + " msg: " + socket.username + ": " + msg);
  	});
  	socket.on("user joined", function(data) {
  		split = data.split(":");
  		socket.id = ++users;
  		socket.chat = split[0];
  		socket.username = split[1];
  		userdata.push(socket.chat + ":" + socket.username);
		console.log(socket.chat + " join: " + socket.username);
  		io.emit("update list", userdata);
  	});
	socket.on("disconnect", function() {
		if (socket.chat && socket.username) {
			console.log(socket.chat + " leave: " + socket.username);
			for (var i = 0; i < userdata.length; i++) {
				split = userdata[i].split(":");
				if (split[1] == socket.username) {
					userdata.splice(i, 1);
				}
			}
			io.emit("update list", userdata);
		}
    });
    socket.on("request user amount", function(chat) {
    	chatUsers = 0;
    	for (var i = 0; i < userdata.length; i++) {
    		split = userdata[i].split(":");
    		if (chat == split[0]) {
    			chatUsers++;
    		}
    	}
    	socket.emit("send user amount", chat + ":" + chatUsers);
    });
    socket.on("request names", function() {
    	io.sockets.connected[socket.id].emit("serve names", userdata);
    });
});

http.listen(3000, function() {
	console.log("listening on *:3000");
});