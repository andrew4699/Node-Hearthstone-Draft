"use strict";

var express = require("express");
var app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http);

global.config = require("../config.json");

app.use(express.static(__dirname + "/../client"));

global.constants = {};

// Includes

require("./includes/functions");

require("./includes/classes/user");
require("./includes/classes/draft");

// Variables

global.users = [];
global.draft = new Draft();

// Functions

function onServerStart(port)
{
	clearConsole();

	println("Server started on *:" + port);

	print("[Server has been initailized]");
	println("-----------------------------");
}

function onServerShutdown()
{
	process.exit();
}

// Sockets

io.on("connection", function(socket)
{
	var name = socket.handshake.query.name;

	for(var i = 0; i < users.length; i++)
	{
		if(users[i].name == name)
		{
			socket.emit("nameTaken");
			return;
		}
	}

	var user = new User(socket, name);
	users.push(user);

	user.onConnect();

	socket.on("disconnect", function()
	{
		user.onDisconnect();
	});

	socket.on("playerOne", function(name)
	{
		draft.playerOne.name = name;
	});

	socket.on("playerTwo", function(name)
	{
		draft.playerTwo.name = name;
	});

	socket.on("ready", function()
	{
		user.onReady();
	});

	socket.on("pick", function(hero)
	{
		user.onPick(hero);
	});

	socket.on("lock", function(hero)
	{
		user.onLock(hero);
	});

	socket.on("ban", function(hero)
	{
		user.onBan(hero);
	});
});

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

process.on("SIGTERM", onServerShutdown);
process.on("SIGINT", onServerShutdown);
process.once("SIGUSR2", onServerShutdown);

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// Don't touch, IP configurations.

var nodeIP = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1";
var nodePort = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || config.port;

if(process.env.OPENSHIFT_NODEJS_IP !== undefined)
{
	http.listen(nodePort, nodeIP, function()
	{
		onServerStart(nodePort);
	});
}
else
{
	http.listen(nodePort, function()
	{
		onServerStart(nodePort);
	});
}
