"use strict";

global.Draft = function()
{
	this.hidden = {};

	this.state = Draft.STATE_IDLE;

	this.playerOne = {name: "", ready: false, picks: [{}, {}, {}, {}]};
	this.playerTwo = {name: "", ready: false, picks: [{}, {}, {}, {}]};

	this.hidden.sendDataInterval = setInterval(this.sendData.bind(this), SEND_DATA_INTERVAL);
}

// Callbacks

Draft.prototype.onConnect = function()
{
	
}

// Functions

Draft.prototype.sendData = function()
{
	User.emitToAll("sendData", safeObject(this));
}

Draft.prototype.start = function()
{
	this.state = Draft.STATE_PICKING;
	this.player = Math.ceil(Math.random() * 2);

	this.picks = 0;
	this.bans = 0;
}

Draft.prototype.getPlayer = function(name)
{
	if(this.playerOne.name == name) return this.playerOne;
	else if(this.playerTwo.name == name) return this.playerTwo;
	else return null;
}

Draft.prototype.switchPlayer = function()
{
	if(this.player == 1) this.player = 2;
	else this.player = 1;
}

// Static Variables

var SEND_DATA_INTERVAL = 500;

Draft.STATE_IDLE = 0;
Draft.STATE_PICKING = 1;
Draft.STATE_BANNING = 2;
Draft.STATE_COMPLETE = 3;

// Static Functions