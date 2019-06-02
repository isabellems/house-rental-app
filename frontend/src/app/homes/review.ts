export class Review {
	constructor(  
	   public text: String, 
	   public rating: Number,
	   public home?: {
	   	id:String,
	   	name:String
	   },
	   public author?: {
	   	id: String,
	   	username:String
	   }
	){}	
}
