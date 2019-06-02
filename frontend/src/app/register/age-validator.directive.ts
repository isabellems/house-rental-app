import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
@Directive({
    selector: '[isAdult][formControlName],[isAdult][formControl],[isAdult][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => AgeValidator), multi: true }
    ]
})

export class AgeValidator implements Validator {
	 constructor( @Attribute('isAdult') public isAdult: string) {}
   
	validate(c: AbstractControl): {} {
	    let v = +c.value;
	    let year = (new Date()).getFullYear();
	    if(year-v < 18) return {
	    	isAdult: false
	    }
	    return null;
	}
}
