var express = require("express"),
	_ = require("underscore"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	app = express();

app.use(bodyParser.urlencoded({extended: true}));
//where to find js and css files
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost/hashmere');
var db = require("./models/user");

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/views/index.html");
})










app.listen(3000, function() {
	console.log("I'm listening");
});