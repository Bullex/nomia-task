import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonService } from '@shared/service/common.service';
import data from './json/data.json';

@Injectable({
  providedIn: 'root'
})
export class JsonApiService {

  get(url: string): Observable<any> {
    let flatRecords;

    switch (url) {
      case '/records':
        return of(data.records);
      case '/sections':
        flatRecords = CommonService.flattenDeep(data.records);
        const sections = flatRecords.filter(record => typeof record.sale === 'undefined')
        return of(sections);
      case '/root-items':
        flatRecords = CommonService.flattenDeep(data.records, true);
        const items = flatRecords.filter(record => typeof record.sale !== 'undefined')
        return of(items);
      default:
        const id = url.substring(url.lastIndexOf('/') + 1);
        flatRecords = CommonService.flattenDeep(data.records);
        return of(flatRecords.find(rec => rec.id === id));
    }
  }
}
