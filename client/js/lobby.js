var DRAFT_STATE_IDLE = 0;
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