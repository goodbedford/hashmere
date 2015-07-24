var express = require("express"),
	_ = require("underscore"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	session = require("express-session"),
	Twitter = require("mtwitter"),
	dotenv = require("dotenv"),
	app = express();

dotenv.load();

var env = process.env;

//session cookie middleware
app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: env.SESSION_KEY,
	cookie: {maxAge: 60000}
}));
// middleware to manage sessions
app.use('/', function (req, res, next) {

  // saves userId in session for logged-in user
  req.login = function (user) {
  	if (user !== undefined) {
    req.session.userId = user.id;
  	} else {
  		req.session.userId = null;
  	}
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

mongoose.connect(
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/hashmere');
var db = require("./models/user");

var twitter = new Twitter({
    consumer_key: env.consumerKey,
    consumer_secret: env.consumerSecret,
    application_only: true
});

// var twitterUser = new Twitter({
//     consumer_key: env.consumerKey,
//     consumer_secret: env.consumerSecret,
//     access_token_key: "SUPER SECRET",
//     access_token_secret: "TRULY SECRET"
// });


app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/views/index.html");
});

app.get("/profile", function(req, res) {
	req.currentUser(function(err, user) {
		if (user != undefined) {
		    res.send(user);
		} else {
			res.send("no user");
		}
	});
});

app.post("/signup", function(req, res) {
	if (req.body.password.length < 8) {
		res.status(400).send({message: "invalid password: Needs to be at least 8 characters"});
	} else {
		db.User.find({email: req.body.email}, function(err, found) {
			if (found.length > 0) {
				res.status(400).send({message: "email already exists"});
			} else {
				var newUser = {
					email: req.body.email,
					password: req.body.password
				};
				db.User.createSecure(newUser.email, newUser.password, function(err, user) {
					res.send(user);
				});
			};
		});
	};
});

app.post("/login", function(req, res) {
	var userData = {
		email: req.body.email,
		password: req.body.password
	};
	db.User.authenticate(userData.email, userData.password, function(err, user) {
		if (user != undefined) {
			req.login(user);
			res.redirect("/profile");
		} else {
			res.status(400).send({message: "bad username or password"});
		}	
	});
});

app.get("/logout", function(req, res) {
	req.logout();
	res.send("Success");
});

app.put("/search", function(req, res) {
	req.currentUser(function(err, user) {
		if (user != undefined) {
			db.Tag.find({name: req.body.name}, function(err, found) {
				var temp = _.findWhere(user.tags, {name: req.body.name});
				if (!temp) {
					if (found.length > 0) {
						user.tags.push(found[0]);
						user.save();
					} else {
						var newTag = new db.Tag({
							name: req.body.name
						});
						newTag.save();
						user.tags.push(newTag);
						user.save();
					};
				};	
			});
			twitter.get("https://api.twitter.com/1.1/search/tweets.json?", {q: req.body.name, result_type: "recent", count: 12}, function(err, tweets) {
				res.json(tweets);
			});
		} else {
			twitter.get("https://api.twitter.com/1.1/search/tweets.json?", {q: req.body.name, result_type: "recent", count: 12}, function(err, tweets) {
				res.json(tweets);
			});
		};
	});
});

app.put("/tag", function(req, res) {
	twitter.get("https://api.twitter.com/1.1/search/tweets.json?", {q: req.body.name, result_type: "recent", count: 12}, function(err, tweets) {
		res.json(tweets);
	});
});

app.delete("/tag", function(req, res) {
	req.currentUser(function(err, user) {
		if (user != undefined) {
			db.User.findOneAndUpdate({_id: user.id}, {$pull: {tags: {name: req.body.name}}}, function(err, updated) {
				updated.save();
				res.send("deleted");
			})
		} else {
			res.send("nothing to delete from db");
		}
	});
});

app.put("/lastsearch", function(req, res) {
	req.currentUser(function(err, user) {
		if (user!= undefined) {
			twitter.get("https://api.twitter.com/1.1/search/tweets.json?", {q: req.body.name, result_type: "recent", count: 12}, function(err, tweets) {
				res.json(tweets);
			});				
		} else {
			res.send("not a user");
		};
	});
});


app.listen(process.env.PORT || 3000);