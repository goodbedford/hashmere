$(function() {

	    $(document).ajaxStart(function () {
	        $("#loading").show();
    	}).ajaxStop(function () {
	        $("#loading").hide();
	    });

	function hashmereController () {};

	hashmereController.prototype.template = _.template($("#template").html());
	hashmereController.prototype.navTemplate = _.template($("#navTemplate").html());
	hashmereController.prototype.tagTemplate = _.template($("#tagTemplate").html());

	hashmereController.prototype.round5 = function(num) {
		return Math.ceil(num/5)*5;
	};
	
	hashmereController.prototype.render = function(obj) {
		_.each(obj, function(item) {
				$("#socialMedia").prepend(hashmereController.prototype.template(item));

				var target = $("#"+item.id_str);
				var id = item.id_str;

				// twttr.widgets.createTweet(id, target[0], 
				//   {
				//     conversation : 'none',    // or all
				//     cards        : 'hidden',  // or visible 
				//     theme        : 'light',    // or dark
				//     width        : '300'	
				//   })
				//   .then(function() {
				// 		var temp = $("#"+item.id_str+" iframe");
				// 		$(temp[0].contentDocument.getElementsByClassName("EmbeddedTweet")[0]).attr("style", "overflow:scroll; height:120px");
				//   })
				twttr.widgets.createTweet(id, target[0], 
				  {
				    conversation : 'none',    // or all
				    cards        : 'hidden',  // or visible 
				    theme        : 'light',    // or dark
				    width        : '300'	
				  })
				  .then(function() {
						var temp = $("#"+item.id_str);
						var ifrm = $("#"+item.id_str + " iframe");
						var hgt = $($("#"+item.id_str + " iframe")[0]).attr("height");
						$($(temp[0]).attr("class", "grid-item grid-item--"+hgt));
						$($(ifrm[0]).attr("style", style="border: none; max-width: 100%; min-width: 220px; margin: 0px 0px; padding: 0px; display: block; position: static; visibility: visible; width: 300px;"));
						$(".grid").masonry('layout');
				  }).then($('.grid').masonry({
					  columnWidth: 301,
					  itemSelector: '.grid-item'
					})).then($(".grid").masonry('reloadItems'));
		});
			// $(".grid").masonry('layout');
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
			error: function(res, status, error) {
				alert(res.responseJSON.message);
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
			error: function(res, status, error) {
				alert(res.responseJSON.message);
			}
		});
	};

	hashmereController.prototype.logout = function() {
		$.ajax({
			url: "/logout",
			type: "GET",
			success: function(res) {
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
				if ($("#tag-"+obj.name).length > 0) {
					console.log("tag exists");
				} else {
					$("#searchTags").append(hashmereController.prototype.tagTemplate(obj));
					$("#tag-"+obj.name).on("click", function() {
						var searchAgain = {name: $(this).attr("data-name")};
						hashmereController.prototype.savedTag(searchAgain);
					});
					$("#close-"+obj.name).on("click", function() {
						var tagDel = {name: $(this).attr("data-name")};
						hashmereController.prototype.deleteTag(tagDel);
					});
				}								
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
			$("#signupForm")[0].reset();
			hashmereController.prototype.signup(newSignup);
		});

		$("#newpassword").on("input", function() {
			if ($("#newpassword").val().length >= 8) {
				$("#passwordcheck").attr("class", "has-success");
				$("#helppassword").attr("style", "display:none");
			} else if (($("#newpassword").val().length < 8) && ($("#newpassword").val().length > 0)) {
				$("#passwordcheck").attr("class", "has-warning");
				$("#helppassword").attr("style", "display:block");
			} else {
				$("#passwordcheck").removeAttr("class", "has-warning");
				$("#passwordcheck").removeAttr("class", "has-success");
				$("#helppassword").attr("style", "display:none");
			};
		});

		$("#newpasswordrepeat").on("input", function() {
			if (($("#newpasswordrepeat").val() === ($("#newpassword").val())) && ($("#newpassword").val().length >= 8)) {
				$("#helppasswordcheck").attr("style", "display:none");
				$("#signupBtn").prop("disabled", false);
				$("#passwordrecheck").attr("class", "has-success");
			} else if (($("#newpasswordrepeat").val()) != ($("#newpassword").val())) {
				$("#helppasswordcheck").attr("style", "display:block");
				$("#helppasswordcheck1").attr("style", "display:none");
				$("#signupBtn").prop("disabled", true);
				$("#passwordrecheck").attr("class", "has-warning");
			} else if (($("#newpassword").val().length < 8)) {
				$("#helppasswordcheck1").attr("style", "display:block");
				$("#helppasswordcheck").attr("style", "display:none");
				$("#signupBtn").prop("disabled", true);
				$("#passwordrecheck").attr("class", "has-warning");
			} else {
				$("#helppasswordcheck").attr("style", "display:none");
				$("#helppasswordcheck1").attr("style", "display:none");
				$("#signupBtn").prop("disabled", true);
				$("#passwordrecheck").removeAttr("class", "has-warning");
				$("#passwordrecheck").removeAttr("class", "has-success");
			}
		});

		$("#loginForm").on("submit", function(event) {
			event.preventDefault();
			var email = $("#email").val();
			var password = $("#password").val();

			var login = {email: email, password: password};
			$("#loginForm")[0].reset();
			hashmereController.prototype.login(login);
		});

		$("#email").on("input", function() {
			if ($("#email").val().length >0) {
				$("#loginBtn").prop("disabled", false);
			} else {
				$("#loginBtn").prop("disabled", true);
			}
		});

		$("#search").on("submit", function(event) {
			event.preventDefault();
			console.log("clicked");
			var search = $("#hash-search").val();
			var searchObj = {name: search};
			$("#search")[0].reset();
			hashmereController.prototype.search(searchObj);
		});

		$("#hash-search").on("input", function() {
			if ($("#hash-search").val().length > 0) {
				$("#searchBtn").prop("disabled", false);
			} else {
				$("#searchBtn").prop("disabled", true);
			};
		});				
	};
	
	hashmereController.prototype.setView();


});