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
}