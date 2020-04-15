import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Record } from '../../../../data/schema/record';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-record-details',
  templateUrl: './record-details.component.html',
  styleUrls: ['./record-details.component.scss']
})
export class RecordDetailsComponent implements OnInit {
  record$: Observable<Record>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.record$ = this.route.data.pipe(map(data => data.record));
  }
}
