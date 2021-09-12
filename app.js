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
    let username = req.body.username;
    let password = req.body.password;

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
            if (user.password == password)
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
app.post("/update", async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
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

app.get("/highscores", async (req, res, next) => {
    try {
        //Check if username is already in collection
        result = await collection.find({ username: req.params.username });
        console.log(result);
        res.send(result);
    } catch (e) {
        res.status(500).send({
            message: e.message
        });
    }
    

});

app.listen(process.env.PORT, async () => {
    try {
        await client.connect();
        collection = client.db("AlienAdventure").collection("Player");
        console.log("Listening at :3000...");
    } catch (e) {
        console.error(e);
    }
});