const express = require("express");
const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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
	    res.sendFile(__dirname + "/index.html")
	});

	const checkCreds = async function (req, res) {
        await client.connect()
        console.log("This should have the username -- " + req.body.username)
		if (req.body.username === undefined || req.body.username === null) {
			console.log("username bad input")
		}
        const rPass = await client.get(req.body.username);
		if (rPass === undefined || rPass === null) {
			console.log("rPass not defined")
			res.sendFile(__dirname + "/public/index.html")
		} else if (rPass === req.body.password) {
            res.sendFile(__dirname + "/public/HTML/profile.html");
        } else {
            console.log("Bad login credentials")
			res.sendFile(__dirname + "/public/index.html")
        }
        await client.disconnect()
	}

	const updateBio = async function (req, res, next) {
		await client.connect()
		console.log("This is the updateBio handler")
		if (req.body.updateBio === undefined || req.body.updateBio === null) {
			console.log("There was no bio to update")
		} else {
			client.set(username, {bio:req.body.bio})
		}
	}

	app.post("/test", checkCreds)
	app.post("/updateBio", updateBio)
