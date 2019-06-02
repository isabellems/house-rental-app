var mongoose 	   	       = require("mongoose"),
	passportLocalMongoose  = require("passport-local-mongoose");

var homeSchema = new mongoose.Schema({
	name: String,
	country: String,
	city: String,
	address: String,
	zip_code: String,
	latitude: Number,
	longitude: Number,
	image: String,
	description: String,
	transportation: String,
	dates: [{arrival: String, departure: String}],
	start: String, 
	end:String,
	startDate: Date,
	endDate: Date,
	room_type: String,
	pictures: [String],
	cost_per_day: Number,
	guests: Number,
	beds: Number,
	bathrooms: Number,
	bedrooms: Number,
	sq_meters: Number,
	min_days: Number,
	ratings: [Number],
	internet: Boolean,
	air_condition: Boolean,
	lift: Boolean,
	heating: Boolean,
	kitchen: Boolean,
	living_room: Boolean,
	television: Boolean,
	parking: Boolean,
	smoking: Boolean,
	pets: Boolean,
	parties: Boolean,
	Host: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		image: String,
		username: String,
		user_rating: Number
	  },
	Comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	Reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }]
   },
   {versionKey: false} 
);

module.exports = mongoose.model("Home", homeSchema);