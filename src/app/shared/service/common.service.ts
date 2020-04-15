import { Injectable } from '@angular/core';
import { Record } from '../../data/schema/record';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public static FIRST_LEVEL_ID = 'root'
  public static SECTION_PREFIX = 's'
  public static ITEM_PREFIX = 'i'

  public static flattenDeep(records: Record[], onlyRoot?: boolean): any {
    return records.reduce((acc, elem) => {
      let res = acc;
      res = res.concat([elem])
      if (!onlyRoot) {
        if (Array.isArray(elem.sections)) {
          res = res.concat(CommonService.flattenDeep(elem.sections))
        }
        if (Array.isArray(elem.items)) {
          res = res.concat(CommonService.flattenDeep(elem.items))
        }
      }
      return res
    }, [])
  }

  public static isRootLevelRecord(record: Record): boolean {
    return record.id !== CommonService.FIRST_LEVEL_ID && record.id.match(/\d+/g).length === 1
  }

  public static getLastId(records: Record[]): number {
    // get maximum ID
    return records.reduce((max, record) => {
      const numbers = record.id.match(/\d+/g)
      const id = Array.isArray(numbers) && numbers.length ? parseInt(numbers[numbers.length - 1]) : 0
      return Math.max(max, id)
    }, 0)
  }

  public static treeSearch(records, splittedIdArr, currentLevel, maxLevel, needDelete) {
    return records.reduce((acc, record) => {
      if (record.id === splittedIdArr.slice(0, currentLevel * 2).join('')) {
        if (splittedIdArr[currentLevel * 2 - 2] === CommonService.SECTION_PREFIX) {
          if (currentLevel < maxLevel) {
            // get type of next level record
            const type = splittedIdArr[(currentLevel + 1) * 2 - 2] === CommonService.SECTION_PREFIX ? 'sections' : 'items'
            return this.treeSearch(record[type], splittedIdArr, currentLevel + 1, maxLevel, needDelete)
          }
        }
        if (needDelete) {
          records.splice(records.indexOf(record), 1)
        }
        return record
      }
      return acc
    }, {})
  }
}
