export class Home {
	_id?: String;
	name: String;
	country: String;
	city: String;
	address: String;
	zip_code: String;
	latitude: Number;
	longitude: Number;
	image: String;
	description: String;
	transportation: String;
	dates: [{ arrival:String, departure:String }];
	room_type: String;
	pictures: String[];
	cost_per_day: Number;
	guests: Number;
	beds: Number;
	bathrooms: Number;
	bedrooms: Number;
	sq_meters: Number;
	min_days: Number;
	ratings: Number[];
	internet: Boolean;
	air_condition: Boolean;
	lift: Boolean;
	heating: Boolean;
	kitchen: Boolean;
	living_room: Boolean;
	television: Boolean;
	parking: Boolean;
	smoking: Boolean;
	pets: Boolean;
	parties: Boolean;
	Comments: [any];
	Reviews: [{
		id: String,
		text: String,
		rating: Number,
		author: {
			username: String
		}
	}];
	Host: {
		id: String,
		image: String,
		username: String,
		user_ratings: Number
	};

	constructor( 
	   public startDate: Date,
	   public endDate: Date,
	   public start: String,
	   public end: String
   ){}	
}
