//const uri = "mongodb+srv://Dgenius:IevlMNDNxCQwATn4@cluster0.jsgan.mongodb.net/playerStore?retryWrites=true&w=majority";
//https://www.geeksforgeeks.org/login-form-using-node-js-and-mongodb/
var express = require("express"),
    bodyParser = require("body-parser");
const {
    MongoClient,
    ObjectID
} = require("mongodb");
const uri = "mongodb+srv://Dgenius:IevlMNDNxCQwATn4@cluster0.jsgan.mongodb.net/playerStore?retryWrites=true&w=majority";
const client = new MongoClient(uri);
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var collection;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", async (req, res, next) => {
    console.log("Hello world");
    res.send("Hello World");
});

// Handling user signup
app.post("/register", async (req, res, next) => {
    try {
        //Check if username is already in collection
        user = await collection.findOne({
            username: req.body.username
        });

        console.log(user);
        //If user is not found add them to the collection
        let result;
        if (user == null) {
            result = await collection.insertOne(req.body);
            res.send(result);
        } else
            res.send(result);
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }

});

// Handling user login
app.post("/login", async (req, res, next) => {
    
    try {
        //Check if username is already in collection
        user = await collection.findOne({
            username: req.body.username
        });

        //If user is null or incorrect password send error to client
        console.log(user);
        if (user == null) {
            res.status(401).send({
                message: "Username or password incorrect"
            });
        } else {
            if (user.password == req.body.password)
                res.send(user);
            else
            res.status(401).send({
                message: "Username or password incorrect"
            });
        }

    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }

});

//Handling user login
app.get("/user/:username", async (req, res, next) => {
    try {
        //Check if username is already in collection
        user = await collection.findOne({
            username: req.body.username
        });
        console.log(user);
        res.send(user);

    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
});

//Handling user update
app.post("/replaceOne", async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log("replaceOne");
    console.log(req.body);
    try {
        //Check if username is already in collection
        result = await collection.replaceOne({ username: req.body.username }, req.body, {upsert: false});
        console.log(result);
        res.send(result);
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
});

//Handling update specific variable
app.post("/update", async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log("update");
    try {
        //Check if username is already in collection
        result = await collection.updateOne({ username: req.body.username }, req.body, {upsert: false});
        console.log(result);
        res.send(result);
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
});

//Delete
app.get("/delete/:username", async (req, res, next) => {
    console.log(req.params.username)
    try {
        //Check if username is already in collection
        result = await collection.deleteOne({ username: req.params.username });
        console.log(result);
        res.send(result);
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
    

});

//READ highscores
app.get('/highScores', function (request, respond) {

	//Extracts the field values from the request
	var sortName = request.query['sortName'];

	let sort;
	switch(sortName){
		case "jumps":
			sort = {jumps: -1}
			break;
		case "score":
			sort = {score: -1}
			break;
        case "timeControlllingBothAliens":
            sort = {timeControlllingBothAliens: -1}
            break;
		default:
			sort = {score: -1}
	}

	//find all documents in collection and sort by jumps variable. 1 for ascending and -1 for descending
	collection.find().sort(sort).toArray(function (findError, result) {
		if (!findError) {
			console.log("MongoDB - Find: No Errors");
			let resultArray = result.slice(0,20);
            //Remove Data that highscore doesn't need
            resultArray.forEach(user => {
                delete user.password;
                delete user.objectHashCodeInWorld;
                delete user.objectHashCodePickedUp;
                delete user.worldInitialized;
            });
            console.log(resultArray);
			respond.send(JSON.stringify(resultArray));
		} else {
			console.log("MongoDB - Find: Error");
			console.log(findError);
		}
	});
});

//app.listen(3000, async () => {
app.listen(process.env.PORT, async () => {
    try {
        await client.connect();
        collection = client.db("AlienAdventure").collection("Player");
        console.log("Listening at :3000...");
    } catch (e) {
        console.error(e);
    }
});
