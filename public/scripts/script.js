$(function() {

	function hashmereController () {};

	hashmereController.prototype.template = _.template($("#template").html());
	hashmereController.prototype.navTemplate = _.template($("#navTemplate").html());
	hashmereController.prototype.tagTemplate = _.template($("#tagTemplate").html());
	
	hashmereController.prototype.render = function(obj) {
		_.each(obj, function(item) {
				$("#socialMedia").prepend(hashmereController.prototype.template(item));

				var target = $("#"+item.id_str);
				var id = item.id_str;

				twttr.widgets.createTweet(id, target[0], 
				  {
				    conversation : 'none',    // or all
				    cards        : 'hidden',  // or visible 
				    theme        : 'light',    // or dark
				    width        : '300'	
				  })
				  .then(function() {
				  	var temp = $("#"+item.id_str+" iframe");
					$(temp[0].contentDocument.getElementsByClassName("EmbeddedTweet")[0]).attr("style", "overflow:scroll; height:120px");
				  })				
		});
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
						_.each(tweetData, function(item) {
							$("#searchTags").append(hashmereController.prototype.tagTemplate(item));
							$("#tag-"+item.name).on("click", function() {
								var searchAgain = {name: $(this).attr("data-name")};
								hashmereController.prototype.savedTag(searchAgain);
							});
							$("#close-"+item.name).on("click", function() {
								var tagDel = {name: $(this).attr("data-name")};
								hashmereController.prototype.deleteTag(tagDel);
							});							
						});
						hashmereController.prototype.lastSearch(tweetData[len].name);						
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
				$("#socialMedia").replaceWith($("#resetContent").html());
				hashmereController.prototype.render(tweetArr);
				$("#searchTags").append(hashmereController.prototype.tagTemplate(obj));
				$("#tag-"+obj.name).on("click", function() {
					var searchAgain = {name: $(this).attr("data-name")};
					hashmereController.prototype.savedTag(searchAgain);
				});
				$("#close-"+obj.name).on("click", function() {
					var tagDel = {name: $(this).attr("data-name")};
					hashmereController.prototype.deleteTag(tagDel);
				});								
			},
			error: function() {
				console.log("error!");
			}
		});
	};

	hashmereController.prototype.lastSearch = function(obj) {
		$.ajax({
			url: "/lastsearch",
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

	hashmereController.prototype.savedTag = function(obj) {
		$.ajax({
			url: "/tag",
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

	hashmereController.prototype.deleteTag = function(obj) {
		$.ajax({
			url:"/tag",
			type:"DELETE",
			data: obj,
			success: function(res) {
				$("#div-"+obj.name).remove();
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