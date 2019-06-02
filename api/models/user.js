var mongoose 	   	     = require("mongoose"),
	passportLocalMongoose  = require("passport-local-mongoose"),
   jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
   username: String,
   email: String,
   phone: Number,
   firstname: String,
   hostRequestSent: Boolean,
   host: Boolean,
   admin: Boolean,
   visitor: Boolean,
   lastname: String,
   image: String,
   password: String,
   day: String,
   month: String,
   year: String,
   description: String,
   city: String,
   country: String,
   image: String,
   searchedLocations: [String],
   searchedGuests: [Number],
   searchedDates: [{arrival: String, departure: String}],
   housesViewed: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home"
   }],
   recommended : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home"
   }],
   hosting : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home"
   }],
   visited: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home"
   }],
   Reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }]
});

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    exp: parseInt(expiry.getTime() / 1000),
  }, ""); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

userSchema.plugin(passportLocalMongoose, {
		usernameField: "email"
	}
);

module.exports = mongoose.model("User", userSchema);