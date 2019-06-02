var mongoose 	   	       = require("mongoose"),
	passportLocalMongoose  = require("passport-local-mongoose");


var reviewSchema = new mongoose.Schema({
	text: String,
	rating: Number,
    home: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Home"
        },
        name: String
    },
    author: {
    	id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Review", reviewSchema);