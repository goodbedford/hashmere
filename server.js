var express = require("express"),
	_ = require("underscore"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	session = require("express-session"),
	app = express();

	//Seed data
	var seedTwitter = {tag: "starbucks", tweets: [{
		id: 621748676776431617,
		id_str: "621748676776431617" 
	}, {
		id: 621815451362799616,
		id_str: "621815451362799616" 
	}, {
		id: 621748676776431617,
		id_str: "621748676776431617" 
	}, {
		id: 621815451362799616,
		id_str: "621815451362799616" 
	}]}	

//session cookie middleware
app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: "SuperSecretSauce",
	cookie: {maxAge: 60000}
}));
// middleware to manage sessions
app.use('/', function (req, res, next) {
  // saves userId in session for logged-in user
  req.login = function (user) {
    req.session.userId = user.id;
  };
  // finds user currently logged in based on `session.userId`
  req.currentUser = function (callback) {
    db.User.findOne({_id: req.session.userId}, function (err, user) {
      req.user = user;
      callback(null, user);
    });
  };
  // destroy `session.userId` to log out user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };
  next();
});

//body-parser
app.use(bodyParser.urlencoded({extended: true}));
//where to find js and css files
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost/hashmere');
var db = require("./models/user");

app.get("/", function(req, res) {
	req.currentUser(function(err, user) {
		if (user !== null) {
			res.sendFile(__dirname + "/public/views/index.html");
		} else {
			res.sendFile(__dirname + "/public/views/index.html");		}
	});
});

app.get("/profile", function(req, res) {
	res.json(seedTwitter);
})

app.post("/signup", function(req, res) {
	var newUser = {
		email: req.body.email,
		password: req.body.password
	};
	db.User.createSecure(newUser.email, newUser.password, function(err, user) {
		res.send(user);
	});
});

app.post("/login", function(req, res) {
	var userData = {
		email: req.body.email,
		password: req.body.password
	};
	db.User.authenticate(userData.email, userData.password, function(err, user) {
		req.login(user);
		res.redirect("/");
	});
});







app.listen(3000, function() {
	console.log("I'm listening");
});