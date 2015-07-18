var express = require("express"),
	_ = require("underscore"),
	bodyParser = require("body-parser"),
	app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/views/index.html")
})










app.listen(3000, function() {
	console.log("I'm listening");
});