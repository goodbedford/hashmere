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
				console.log(tweetData);
				hashmereController.prototype.render(tweetData);
			},
			error: function() {
				console.log("error!");
			}
		})		
	};
	
	hashmereController.prototype.all();
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