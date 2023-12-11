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
		res.cookie('data', JSON.stringify(await client.hGetAll(req.body.username)))
		res.cookie('user', req.body.username)
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

    let username = req.body.username1;//|| req.cookies.user;

    if (!username) {
        console.log("No username found in request body or cookies");
        res.status(400).send("Username is required");
        await client.disconnect();
        return;
    }
    
	await client.disconnect();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/login", checkCreds)
app.post("/updateBio", updateBio)
app.post("/getFriends", getFriends)
