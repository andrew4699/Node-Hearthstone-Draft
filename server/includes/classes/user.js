"use strict";

global.User = function(socket, name)
{
	this.socket = socket;
	this.ip = socket.request.connection.remoteAddress;

	this.id = User.nextUserID;
	User.nextUserID++;

	this.name = name;
}

// Callbacks

User.prototype.onConnect = function()
{
	print(this.name + " (#" + this.id + ") has connected with IP " + this.ip);
	this.emitToAll("addUser", this.name);

	var userList = [];

	for(var i = 0; i < users.length; i++)
	{
		userList.push(users[i].name);
	}

	this.socket.emit("connected", userList);
}

User.prototype.onDisconnect = function()
{
	print(this.name + " (#" + this.id + ") has disconnected");
	this.emitToAll("removeUser", this.name);

	for(var i = 0; i < users.length; i++)
	{
		if(users[i] == this)
		{
			users.splice(i, 1);
			break;
		}
	}
}

User.prototype.onReady = function()
{
	if(draft.state == Draft.STATE_IDLE)
	{
		var player = draft.getPlayer(this.name);

		if(player)
		{
			player.ready = !player.ready;

			if(draft.playerOne.ready && draft.playerTwo.ready)
			{
				draft.start();
			}
		}
	}
}

User.prototype.onPick = function(hero)
{
	if(draft.state == Draft.STATE_PICKING)
	{
		var player = draft.getPlayer(this.name);
		var index = Math.floor(draft.picks / 2);

		player.picks[index].name = hero;
		player.picks[index].picking = true;
	}
}

User.prototype.onLock = function(hero)
{
	if(draft.state == Draft.STATE_PICKING)
	{
		var player = draft.getPlayer(this.name);

		if(player)
		{
			var index = Math.floor(draft.picks / 2);

			player.picks[index].name = hero;
			player.picks[index].picking = false;

			draft.picks++;

			draft.switchPlayer();

			if(draft.picks == 8)
			{
				draft.state = Draft.STATE_BANNING;
			}
		}
	}
}

User.prototype.onBan = function(hero)
{
	if(draft.state == Draft.STATE_BANNING)
	{
		if(draft.playerOne.name == this.name && draft.player == 1)
		{
			for(var i = 0; i < draft.playerTwo.picks.length; i++)
			{
				if(draft.playerTwo.picks[i].name == hero && !draft.playerTwo.picks[i].banned)
				{
					draft.playerTwo.picks[i].banned = true;
					draft.switchPlayer();
					draft.bans++;
					break;
				}
			}
		}
		else if(draft.playerTwo.name == this.name && draft.player == 2)
		{
			for(var i = 0; i < draft.playerOne.picks.length; i++)
			{
				if(draft.playerOne.picks[i].name == hero && !draft.playerOne.picks[i].banned)
				{
					draft.playerOne.picks[i].banned = true;
					draft.switchPlayer();
					draft.bans++;
					break;
				}
			}
		}

		if(draft.bans == 4)
		{
			draft.state = Draft.STATE_COMPLETE;
		}
	}
}

// Functions

User.prototype.emitToAll = function(message, data)
{
	for(var i = 0; i < users.length; i++)
	{
		if(users[i] != this)
		{
			users[i].socket.emit(message, data);
		}
	}
}

// Static Variables

User.nextUserID = 0;

// Static Functions

User.emitToAll = function(message, data)
{
	for(var i = 0; i < users.length; i++)
	{
		users[i].socket.emit(message, data);
	}
}

User.getUserByName = function(name)
{
	for(var i = 0; i < users.length; i++)
	{
		if(users[i].name == name)
		{
			return users[i];
		}
	}
}