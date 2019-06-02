export class User {

	constructor(   
	   public email: string,
	   public password: string,
	   public username?: string,
	   public firstname?: string,
	   public lastname?: string,
	   public month?: string,
	   public day?: string,
	   public year?: string,
	   public description?: string,
	   public city?: string,
	   public country?: string,
	   public image?: string,
	   public _id?: string,
	   public phone?: number,
	   public hostRequestSent?: Boolean,
	   public host?: Boolean,
	   public admin?: Boolean,
	   public visitor?: Boolean,
	   public visited?: [any],
	   public hosting?: [any],
	   public Reviews?: [any]
	   ){}	
}
