$(function() {

	//Seed data
	var seedTwitter = [{
		id: "tweet",
		tweetID: "621748676776431617" 
	}, {
		id: "tweet1",
		tweetID: "621815451362799616" 
	}, {
		id: "tweet2",
		tweetID: "621748676776431617" 
	}, {
		id: "tweet3",
		tweetID: "621815451362799616" 
	}]

	var template = _.template($("#template").html());
	_.each(seedTwitter, function(twit) {
		$("#socialMedia").prepend(template(twit));
	});







});





window.onload = (function(){

	var $tweet = $(".cards");
	var id = $($tweet[0]).attr("tweetId");

	for (i = 0; i < $tweet.length; i++) {
		var target = $tweet[i];
		var id = $($tweet[i]).attr("tweetId");

	twttr.widgets.createTweet(id, target, 
	  {
	    conversation : 'none',    // or all
	    cards        : 'hidden',  // or visible 
	    theme        : 'light'    // or dark
	  });
	}
});