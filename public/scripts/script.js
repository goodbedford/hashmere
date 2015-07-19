$(function() {

	function hashmereController () {};

	hashmereController.prototype.template = _.template($("#template").html());
	hashmereController.prototype.render = function(obj) {
		_.each(obj, function(item) {
			$("#socialMedia").prepend(hashmereController.prototype.template(item));
		});
	};

	hashmereController.prototype.all = function() {
		$.ajax({
			url: "/profile",
			type: "GET",
			success: function(res) {
				var tweetData = res.tweets;
				hashmereController.prototype.render(tweetData);
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
				console.log(res);
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
	}
	
	hashmereController.prototype.setView();
});

window.onload = (function(){

	var $tweet = $(".cards");
	var id = $($tweet[0]).attr("id_str");

	for (i = 0; i < $tweet.length; i++) {
		var target = $tweet[i];
		var id = $($tweet[i]).attr("id_str");

	twttr.widgets.createTweet(id, target, 
	  {
	    conversation : 'none',    // or all
	    cards        : 'hidden',  // or visible 
	    theme        : 'light'    // or dark
	  });
	}
});