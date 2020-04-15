import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonService } from '@shared/service/common.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  get(url: string): Observable<any> {
    const records = JSON.parse(localStorage.getItem('records'))
    switch (url) {
      case '/records':
        if (records && records.length) {
          return of(records)
        }
        return null;
      case '/sections':
        if (records && records.length) {
          const flatRecords = CommonService.flattenDeep(records);
          const sections = flatRecords.filter(record => typeof record.sale === 'undefined')
          return of(sections);
        }
        return null;
      case '/root-items':
        if (records && records.length) {
          const flatRecords = records.flat();
          const items = flatRecords.filter(record => typeof record.sale !== 'undefined')
          return of(items);
        }
        return null;
      default:
        const id = url.substring(url.lastIndexOf('/') + 1);
        if (records && records.length) {
          const flatRecords = CommonService.flattenDeep(records);
          const foundedRecord = flatRecords.find(rec => rec.id === id)
          return foundedRecord ? of(foundedRecord) : null;
        }
        return null;
    }
  }
}
