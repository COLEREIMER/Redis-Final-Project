const e = require("express");
const express = require("express");
const app = express();
// const cookieParser = require('cookie-parser');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// app.use(cookieParser());

const redis = require("redis");
const client = redis.createClient({
	    password: 'wIaMfjYcxTVDYUUefnld63D0OOPqGfe4',
	    socket: {
		            host: 'redis-11368.c1.us-west-2-2.ec2.cloud.redislabs.com',
		            port: 11368
		        }
});

app.use(express.static(__dirname + "/public"));
app.listen(3000, () => {
	console.log("Listening on port 3000");
});
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/public/index.html")
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const checkCreds = async function (req, res) {
    await client.connect()
    console.log("This should have the username -- " + req.body.username)
	if (req.body.username === undefined || req.body.username === null) {
		console.log("username bad input")
	}
    const rPass = await client.hGet(req.body.username, 'password', function (err, obj) {
		rPass = obj;
	 });
	if (rPass === undefined || rPass === null) {
		console.log("rPass not defined")
		res.sendFile(__dirname + "/public/index.html")
	} else if (rPass === req.body.password) {
		logins = await client.get(req.body.username + "Logins")
		if (!logins) {
			await client.set(req.body.username + "Logins", 1)
			logins = client.get(req.body.username + "Logins")
		} else {
			await client.incr(req.body.username + "Logins")
		}
		res.cookie('data', JSON.stringify(await client.hGetAll(req.body.username)))
		res.cookie('user', req.body.username)
		res.cookie('logins', logins)
        res.sendFile(__dirname + "/public/HTML/profile.html");
    } else {
        console.log("Bad login credentials " + rPass)
		res.sendFile(__dirname + "/public/index.html")
    }
    await client.disconnect()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const updateBio = async function (req, res) {
	await client.connect()
	console.log("This is the updateBio handler")
	if (req.body.newBio === undefined || req.body.newBio === null) {
		console.log("There was no bio to update")
	} else {
		await client.hSet(req.body.username, 'bio', req.body.newBio)
		// res.cookie('data', JSON.stringify(await client.hGetAll(req.body.usernameBio)))
		// res.cookie('user', req.body.usernameBio)
	}
	if (req.body.username === undefined || req.body.username === null) {
		console.log("usernameBio is null and problems are happening")
		console.log(req.body.username)
	} else {
	res.cookie('data', JSON.stringify(await client.hGetAll(req.body.username)))
	res.cookie('user', req.body.username)
	}
	res.sendFile(__dirname + "/public/HTML/profile.html");
	await client.disconnect()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getFriends = async function (req, res) {
    await client.connect();
    console.log("This is the getFriends handler");

    let username = req.body.username1; // || req.cookies.user;

    if (!username) {
        console.log("No username found in request body or cookies");
        res.status(400).send("Username is required");
        await client.disconnect();
        return;
    }

    const friendsList = await client.hGet(username, 'friends');
        
    if (friendsList === null) {
        console.log("No friends list found for this user");
        res.status(404).send("No friends list found");
    } else {
        res.json({ friends: friendsList.split(',') }); // Send back a JSON response
    }
    await client.disconnect();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const searchCache = async function (req, res) {
    await client.connect();
    console.log("This is the searchCache handler");

    username = req.body.username2;
	query = req.body.newSearch;

    if (!username) {
        console.log("No username found in request body");
        res.status(400).send("Username is required");
        await client.disconnect();
        return;
    }
	if (!query) {
		console.log("no query given")
	} else {
    	names = await client.KEYS('*' + query + '*');
		console.log(names)
	}

    if (names === null || names === undefined) {
        console.log("No profiles found");
        res.status(404).send("No profiles found");
    } else {
		if (!username) {
			console.log("username not sent to handler")
		}
        res.cookie('data', names)
		res.cookie('username', username)
		res.sendFile(__dirname + '/public/HTML/search.html')
    }
    await client.disconnect();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////

const returnToProfile = async function (req, res) {
    await client.connect()
    console.log("This is the return handler")
	let username = req.body.username;
	let data = await client.hGetAll(username)
	if (username === undefined || username === null) {
		console.log("username bad input")
		res.sendFile(__dirname + "/public/index.html")
	} else {
		res.cookie('data', JSON.stringify(data))
		res.cookie('user', username)
		res.sendFile(__dirname + "/public/HTML/profile.html")
	}
    await client.disconnect()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/login", checkCreds)
app.post("/updateBio", updateBio)
app.post("/getFriends", getFriends)
app.post("/search", searchCache)
app.post("/return", returnToProfile)
