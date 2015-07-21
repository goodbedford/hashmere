$(function() {

	function hashmereController () {};

	hashmereController.prototype.template = _.template($("#template").html());
	hashmereController.prototype.navTemplate = _.template($("#navTemplate").html());
	hashmereController.prototype.render = function(obj) {
		_.each(obj, function(item) {
			$("#socialMedia").prepend(hashmereController.prototype.template(item));
		});

		var $tweet = $(".cards");

		for (i = 0; i < $tweet.length; i++) {
			var target = $tweet[i];
			var id = $($tweet[i]).attr("id_str");

		twttr.widgets.createTweet(id, target, 
		  {
		    conversation : 'none',    // or all
		    cards        : 'visible',  // or visible 
		    theme        : 'light'    // or dark
		  });
		};		
	};

	hashmereController.prototype.all = function() {
		$.ajax({
			url: "/profile",
			type: "GET",
			success: function(res) {
				if (res.tags) {
					var tweetData = res.tags;
					if (tweetData.length > 0) {
						var len = tweetData.length - 1;
						hashmereController.prototype.saved(tweetData[len].name);
					};
					$("#unique-nav").replaceWith(hashmereController.prototype.navTemplate(res));
					$("#signout").on("click", function() {
						console.log("clicked");
						hashmereController.prototype.logout();
					});						
				} else {
					$("#socialMedia").append($("#anonTemplate").html());
				}
			},
			error: function() {
				console.log("error!");
			}
		});	
	};

	hashmereController.prototype.signup = function(obj) {
		$.ajax({
			url: "/signup",
			type: "POST",
			data: obj,
			success: function(res) {
				hashmereController.prototype.login(obj);
			},
			error: function() {
				console.log("error!");
			}
		});
	};

	hashmereController.prototype.login = function(obj) {
		$.ajax({
			url: "/login",
			type: "POST",
			data: obj,
			success: function(res) {
				location.reload(true);
			},
			error: function() {
				console.log("error!");
			}
		});
	};

	hashmereController.prototype.logout = function() {
		$.ajax({
			url: "/logout",
			type: "POST",
			success: function(res) {
				console.log(res);
				location.reload(true);
			},
			error: function() {
				console.log("error!");
			}
 		});
	};

	hashmereController.prototype.search = function(obj) {
		$.ajax({
			url: "/search",
			type: "PUT",
			data: obj,
			success: function(res) {
				var tweetArr = res.statuses;
				console.log(tweetArr);
				$("#socialMedia").replaceWith($("#resetContent").html());
				hashmereController.prototype.render(tweetArr);				
			},
			error: function() {
				console.log("error!");
			}
		});
	};

	hashmereController.prototype.saved = function(obj) {
		$.ajax({
			url: "/saved",
			type: "PUT",
			data: {name: obj},
			success: function(res) {
				var tweetArr = res.statuses;
				console.log(tweetArr);
				$("#socialMedia").replaceWith($("#resetContent").html());
				hashmereController.prototype.render(tweetArr);
			},
			error: function() {
				console.log("error!");
			}
		});
	};	

	hashmereController.prototype.setView = function() {
		hashmereController.prototype.all();

		$("#signupForm").on("submit", function(event) {
			event.preventDefault();
			var newEmail = $("#newemail").val();
			var newPassword = $("#newpassword").val();

			var newSignup = {email: newEmail, password: newPassword};
			hashmereController.prototype.signup(newSignup);
		});
		$("#loginForm").on("submit", function(event) {
			event.preventDefault();
			var email = $("#email").val();
			var password = $("#password").val();

			var login = {email: email, password: password};
			hashmereController.prototype.login(login);
		});
		$("#search").on("submit", function(event) {
			event.preventDefault();
			console.log("clicked");
			var search = $("#hash-search").val();
			var searchObj = {name: search};
			hashmereController.prototype.search(searchObj);
		})				
	}
	
	hashmereController.prototype.setView();
});

// window.onload = (function(){

// 	var $tweet = $(".cards");
// 	var id = $($tweet[0]).attr("id_str");

// 	for (i = 0; i < $tweet.length; i++) {
// 		var target = $tweet[i];
// 		var id = $($tweet[i]).attr("id_str");

// 	twttr.widgets.createTweet(id, target, 
// 	  {
// 	    conversation : 'none',    // or all
// 	    cards        : 'hidden',  // or visible 
// 	    theme        : 'light'    // or dark
// 	  });
// 	}
// });