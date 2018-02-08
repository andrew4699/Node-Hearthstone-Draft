// General

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
}