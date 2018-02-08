if(!location.origin)
{
    location.origin = location.protocol + "//" + location.host;
}

var io = require("socket.io-client");

var socket;

// Constants

var KEY_ENTER = 13;

// Variables

var name;

// jQuery

$(document)
.on("click", "#connect", function()
{
    var name = $('#name').val();

    if(name)
    {
        initialize(name);
    }
})
.on("keyup", "#name", function(event)
{
    if(event.keyCode == KEY_ENTER)
    {
        $('#connect').trigger("click");
    }
});

// Functions

function initialize(name)
{
    if(!socket || !socket.connected)
    {
        socket = io({query: "name=" + name});
        setupSocket(socket);
    }
}

function setupSocket(socket)
{
    socket.on("connect_failed", function()
    {
    	socket.close();
    });

    socket.on("disconnect", function()
    {
        socket.emit("disconnect");
    	socket.close();
    });

    socket.on("nameTaken", function()
    {
        alert("That name is already taken.");
        socket.close();
    });

    socket.on("connected", function(users)
    {
        name = $('#name').val();
        showLobby(users);
    });

    socket.on("addUser", function(name)
    {
        addUser(name);
    });

    socket.on("removeUser", function(name)
    {
        removeUser(name);
    });

    socket.on("sendData", function(data)
    {
        updateDraft(data);
    });
}// General

function random(min, max)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}

String.prototype.capitalizeFirstLetter = function()
{
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function distance2D(pointOne, pointTwo)
{
    var a = pointTwo.x - pointOne.x;
    var b = pointTwo.y - pointOne.y;

    return Math.sqrt((a * a) + (b * b));
}

function getTime()
{
    return Math.floor(Date.now() / 1000);
}

function rectCollision(a, b)
{
    return ((a.x + a.width) > b.x && a.x < (b.x + b.width)) && ((a.y + a.height) > b.y && a.y < (b.y + b.height));
}

// Hero

function getHeroImage(name)
{
    var file;

    if(name)
    {
        file = name + ".jpg";
    }
    else
    {
        file = "none.jpeg";
    }

    return "media/heroes/" + file;
}

function getHeroName(name)
{
    if(name)
    {
        return name.capitalizeFirstLetter();
    }
    else
    {
        return "&nbsp;";
    }
}

// Cookies

function setCookie(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');

    for(var i = 0; i < ca.length; i++)
    {
        var c = ca[i];

        while(c.charAt(0) == ' ')
        {
            c = c.substring(1);
        }

        if(c.indexOf(name) == 0) 
        {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}var DRAFT_STATE_IDLE = 0;
var DRAFT_STATE_PICKING = 1;
var DRAFT_STATE_BANNING = 2;
var DRAFT_STATE_COMPLETE = 3;

var draft;
var picked;

function showLobby(users)
{
	$('#userCount').text(users.length);

	for(var i = 0; i < users.length; i++)
	{
		addUser(users[i]);
	}

	$('#connectContainer').hide();
	$('#lobbyContainer').show();
}

function addUser(name)
{
	$('#users').append("<div>" + name + "</div>");
	$('#playerOne, #playerTwo').append("<option>" + name + "</option>");
}

function removeUser(name)
{
	$('#users > div, #playerOne > option, #playerTwo > option').each(function()
	{
		if($(this).text() == name)
		{
			$(this).remove();
			return;
		}
	});
}

function updateDraft(data)
{
	draft = data;

	// Status

	var currentPlayer;

	if(data.player == 1) currentPlayer = data.playerOne.name;
	else currentPlayer = data.playerTwo.name;

	if(data.state == DRAFT_STATE_IDLE)
	{
		$('#status').text("Waiting for players");
	}
	else if(data.state == DRAFT_STATE_PICKING)
	{
		$('#status').html("<span class='lobbyName'>" + currentPlayer + "</span> is picking");
	}
	else if(data.state == DRAFT_STATE_BANNING)
	{
		$('#status').html("<span class='lobbyName'>" + currentPlayer + "</span> is banning");
	}
	else if(data.state == DRAFT_STATE_COMPLETE)
	{
		$('#status').text("DONE");
	}
	else
	{
		$('#status').text("ERROR");
	}

	// Players

	$('#playerOne').val(data.playerOne.name);
	$('#playerTwo').val(data.playerTwo.name);

	// Ready

	if(data.playerOne.ready)
	{
		$('#playerOneReady').removeClass("disabled");
	}
	else
	{
		$('#playerOneReady').addClass("disabled");
	}

	if(data.playerTwo.ready)
	{
		$('#playerTwoReady').removeClass("disabled");
	}
	else
	{
		$('#playerTwoReady').addClass("disabled");
	}

	// Picks

	if(currentPlayer == name && data.state == DRAFT_STATE_PICKING)
	{
		$('#pickContainer').show();
	}
	else
	{
		$('#pickContainer').hide();
	}

	// Heroes

	for(var i = 0; i <= 7; i++)
	{
		var player = data.playerOne;

		if(i >= 4)
		{
			player = data.playerTwo;
		}

		var index = i;

		if(i >= 4)
		{
			index -= 4;
		}

		var container = $('#heroContainer > div:nth-child(' + (i + 1) + ')');

		if(player.picks[index].name)
		{
			//container.removeClass("hiddenHeight");

			if(player.picks[index].banned)
			{
				container.addClass("banned");
			}
			else if(player.picks[index].picking)
			{
				container.addClass("picking");
			}
			else
			{
				container.removeClass();
			}
		}
		else
		{
			//container.addClass("hiddenHeight");
		}

		$('> img', container).attr("src", getHeroImage(player.picks[index].name));
		$('> div', container).html(getHeroName(player.picks[index].name)).removeClass().addClass(player.picks[index].name);
	}
}

$(document)
.on("change", "#playerOne, #playerTwo", function()
{
	socket.emit($(this).attr("id"), $(this).val());
})
.on("click", "#playerOneReady, #playerTwoReady", function()
{
	socket.emit("ready");
})
.on("click", "#pickContainer > img", function()
{
	if(!$(this).hasClass("disabled") && !$(this).hasClass("picked"))
	{
		$('.temp').removeClass("disabled temp");
		$(this).addClass("disabled temp");

		picked = $(this).attr("id");
		socket.emit("pick", picked);
	}
})
.on("click", "#lock", function()
{
	$('#' + picked).addClass("picked");
	socket.emit("lock", picked);
})
.on("click", "#heroContainer > div", function()
{
	if(($(this).index() < 4 && name == draft.playerTwo.name) || ($(this).index() >= 4 && name == draft.playerOne.name))
	{
		socket.emit("ban", $("> div", this).text().toLowerCase());
	}
});