"use strict";

global.clearConsole = function()
{
	process.stdout.write('\x1Bc');
}

global.print = function(message)
{
	console.log(message);
}

global.println = function(message)
{
	print(message);
	console.log("");
}

global.getTime = function()
{
	return Math.floor(Date.now() / 1000);
}

global.validateEmail = function(email)
{
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

global.distance2D = function(pointOne, pointTwo)
{
    var a = pointTwo.x - pointOne.x;
    var b = pointTwo.y - pointOne.y;

    return Math.sqrt((a * a) + (b * b));
}

global.rectCollision = function(a, b)
{
	return ((a.x + a.width) > b.x && a.x < (b.x + b.width)) && ((a.y + a.height) > b.y && a.y < (b.y + b.height));
}

global.safeObject = function(object)
{
	var safe = {};

	for(var property in object)
	{
		if(object.hasOwnProperty(property))
		{
			if(property != "hidden" && typeof object[property] != "function")
			{
				safe[property] = object[property];
			}
		}
	}

	return safe;
}