var mongoose = require("mongoose"),
	Schema = mongoose.Schema;


var tagSchema = new Schema({
	tag: {type: String, required: true}
});
var Tag = mongoose.model("Tag", tagSchema);


var userSchema = new Schema({
	userName: {type: String, required: true},
	userPassword: {type: String, required: true},
	tags: [tagSchema]
});
var User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.Tag = Tag;