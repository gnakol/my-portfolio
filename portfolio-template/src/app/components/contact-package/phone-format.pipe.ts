import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: number | string): string {
    if (!value) return '';
    const numStr = value.toString();
    
    // Format français : 06 12 34 56 78
    if (numStr.length === 10) {
      return numStr.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    
    // Format court
    if (numStr.length <= 4) {
      return numStr;
    }
    
    // Format par défaut
    return numStr.replace(/(\d{2})(?=\d)/g, '$1 ');
  }
}