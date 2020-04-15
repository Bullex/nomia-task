import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Record } from '../../data/schema/record';
import { RecordService } from '../../data/service/record.service';


@Injectable({
  providedIn: 'root'
})
export class RecordResolver implements Resolve<Record> {
  constructor(
    private recordService: RecordService,
    private router: Router
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    return this.recordService.getSingle(route.params['id'])
      .pipe(catchError((err) => this.router.navigateByUrl('/')));
  }
}
