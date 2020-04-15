import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { Record } from '../../../../data/schema/record';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordService } from '../../../../data/service/record.service';
import { CommonService } from '@shared/service/common.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  record$: Observable<Record>;
  sections: Record[]

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);
  saleFormControl = new FormControl('', []);
  sectionFormControl = new FormControl('', [
    Validators.required,
  ]);

  name: string;
  sale: number;
  section: Record;
  rootSection = {id: CommonService.FIRST_LEVEL_ID, name: 'Основной - первый уровень'}
  rootItems: Record[]

  constructor(
    private route: ActivatedRoute,
    private recordService: RecordService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSections()
    this.loadRootItems()
    this.record$ = this.route.data.pipe(map(data => data.record));
    this.record$.subscribe(record => {
      if (record) {
        this.section = this.sections.find(sect => sect.id === record.id)
      } else {
        this.section = this.rootSection
      }
    })
  }

  loadSections() {
    this.recordService.getAllSections().subscribe(sections => {
      this.sections = [this.rootSection, ...sections]
    })
  }

  loadRootItems() {
    this.recordService.getRootItems().subscribe(items => {
      this.rootItems = items
    })
  }

  save() {
    if (this.name && this.section) {
      let items, prefix;
      if (this.section.id === CommonService.FIRST_LEVEL_ID) {
        // Get only root level sections
        items = this.rootItems
        prefix = CommonService.ITEM_PREFIX
      } else {
        items = this.section.items;
        prefix = this.section.id + CommonService.ITEM_PREFIX
      }
      const newRecord: Record = {
        id: prefix + (CommonService.getLastId(items) + 1),
        name: this.name,
        sale: this.sale || 0
      }
      this.recordService.addRecord(newRecord, this.section.id, 'items')
      this.router.navigate(['']);
    }
  }
}
