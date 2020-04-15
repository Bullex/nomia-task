import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Record } from '../schema/record';
import { JsonApiService } from './json-api.service';
import { StorageService } from './storage.service';
import {CommonService} from '@shared/service/common.service';
import {RecordNode} from '../schema/recordNode';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  constructor (
    private jsonApiService: JsonApiService,
    private storageService: StorageService
  ) {}

  getAll(): Observable<Array<Record>> {
    return this.storageService.get('/records') || this.jsonApiService.get('/records');
  }

  getSingle(id: string): Observable<Record> {
    return this.storageService.get('/records/' + id) || this.jsonApiService.get('/records/' + id);
  }

  saveRecords(records: Record[]): void {
    localStorage.setItem('records', JSON.stringify(records))
  }

  getAllSections(): Observable<Array<Record>> {
    return this.storageService.get('/sections') || this.jsonApiService.get('/sections');
  }

  getRootItems(): Observable<Array<Record>> {
    return this.storageService.get('/root-items') || this.jsonApiService.get('/root-items');
  }

  addRecord(record: Record, parentId: string, type: string): void {
    this.getAll().subscribe((records: Record[]) => {
      if (parentId === CommonService.FIRST_LEVEL_ID) {
        records.push(record)
      } else {
        const splittedIdArr = parentId.split(/(\d+)/).filter(Boolean)
        const maxLevel = splittedIdArr.length / 2
        const parentSection = CommonService.treeSearch(records, splittedIdArr, 1, maxLevel, false)
        parentSection[type].push(record)
      }
      this.saveRecords(records)
    })
  }

  removeRecord(node: RecordNode, records: Record[]): void {
    const splittedIdArr = node.id.split(/(\d+)/).filter(Boolean)
    const maxLevel = splittedIdArr.length / 2
    CommonService.treeSearch(records, splittedIdArr, 1, maxLevel, true)
  }
}
