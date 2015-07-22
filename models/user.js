var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	bcrypt = require("bcrypt"),
	salt = bcrypt.genSaltSync(10);


var TagSchema = new Schema({
	name: {type: String, required: true}
});

var UserSchema = new Schema({
	email: {type: String, required: true},
	passwordDigest: {type: String, required: true},
	tags: [TagSchema]
});


UserSchema.statics.createSecure = function(email, password, callback) {
	var that = this;
	bcrypt.genSalt(function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash) {
			that.create({
				email: email,
				passwordDigest: hash},
				callback);
		});
	});
};

UserSchema.statics.authenticate = function(email, password, callback) {
	this.findOne({email: email}, function(err, user) {
		if (user === null) {
			callback(user);
		} else if (user.checkPassword(password)) {
			callback(null, user);
		}
	});
};

UserSchema.methods.checkPassword = function(password) {
	return bcrypt.compareSync(password, this.passwordDigest);
};


var Tag = mongoose.model("Tag", TagSchema);
var User = mongoose.model("User", UserSchema);

module.exports.User = User;
module.exports.Tag = Tag;