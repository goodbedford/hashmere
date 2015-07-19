$(function() {

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

	var template = _.template($("#template").html());

	_.each(seedTwitter.tweets, function(twit) {
		$("#socialMedia").prepend(template(twit));
	});

	// $.ajax({
	// 	url: "/",
	// 	type: "GET",
	// 	success: function(data) {
	// 		console.log(data);
	// 	}
	// })
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