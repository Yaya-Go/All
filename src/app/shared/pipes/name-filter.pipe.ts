import { Pipe, PipeTransform } from '@angular/core';
import { Seller } from 'src/app/core/models/seller.model';

@Pipe({
  name: 'nameFilter'
})
export class NameFilterPipe implements PipeTransform {

  transform(value: Seller[], name: string): Seller[] {
    if (!name) {
      return value;
    }

    return value.filter(val => val.name.includes(name)) || [];
  }

}
