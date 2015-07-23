var request = require("request"),
	expect = require("chai").expect;

var testEmail = "mochachaitest0@gmail.com";		

describe("Loading main page", function() {
	it("Main Page Load", function(done) {
		request("http://localhost:3000", function(err, res, body) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});

	it("User is anonomous", function(done) {
		request("http://localhost:3000/profile", function(err, res, body) {
			expect(body).to.equal("no user");
			done();
		});
	});
});

describe("Sign Up", function() {
	it("User Password too short", function(done){
		request.post("http://localhost:3000/signup", {form:{email:"mochatest@test.com", password:"testtes"}}, function(err, res, body) {
			expect(res.statusCode).to.equal(400);
			done();
		});
	});

	it("User created", function(done){
		request.post("http://localhost:3000/signup", {form:{email:testEmail, password:"testtest"}}, function(err, res, body) {
			var temp = JSON.parse(body);
			expect(temp).have.keys(["__v", "_id", "tags", "email", "passwordDigest"]);
			done();	
		});		
	});

	it("User already exists", function(done){
		request.post("http://localhost:3000/signup", {form:{email:testEmail, password:"testtest"}}, function(err, res, body) {
			var temp = JSON.parse(body);
			expect(temp).have.key("message");
			done();	
		});		
	});	
});

describe("Logging out", function() {
	it("user logs out", function(done) {
		request("http://localhost:3000/logout", function(err, res, body) {
			expect(res.statusCode).to.equal(200);
			done();	
		});		
	});
});

describe("Logging In", function() {
	it("User Incorrectly Logs in", function(done) {
		request.post("http://localhost:3000/login", {form:{email:"mochatest12129@test.com", password:"testtestfailed"}}, function(err, res, body) {
			console.log(body);
			expect(res.statusCode).to.equal(400);
			done();
		});		
	});

	it("User Signs in Correctly", function(done) {
		request.post("http://localhost:3000/login", {form:{email:testEmail, password:"testtest"}}, function(err, res, body) {
			expect(res.statusCode).to.equal(302);
			done();
		});
	});
});

describe("Searching with Twitter API", function() {
	it("Searching hashtag", function(done) {
		request.put("http://localhost:3000/search", {form:{name:"worldcup"}}, function(err, res, body) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});
});




