import { Pipe, PipeTransform } from '@angular/core';

import { Home } from './homes/home';

@Pipe({
    name: 'homefilter',
    pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: Home[], filter: Home): any[] {
    if (!items || !filter) {
      return items;
    }
    let result = items.filter((item: Home) => this.applyFilter(item, filter));
    if(result.length === 0){
      return [-1];
    }
    else{
      return result;
    }

  }
  
  /**
   * Perform the filtering.
   * 
   * @param {Home} book The book to compare to the filter.
   * @param {Home} filter The filter to apply.
   * @return {boolean} True if book satisfies filters, false if not.
   */
  applyFilter(book: Home, filter: Home): boolean {
    for (let field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (book[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        }
        else if (typeof filter[field] === 'number') {
          if (book[field] > filter[field]) {
            return false;
          }
        }
        else if(typeof filter[field] === 'boolean'){
           if (book[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}