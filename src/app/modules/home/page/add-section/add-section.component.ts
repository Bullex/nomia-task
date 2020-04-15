import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { Record } from '../../../../data/schema/record';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordService } from '../../../../data/service/record.service';
import { CommonService } from '@shared/service/common.service';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss']
})
export class AddSectionComponent implements OnInit {
  record$: Observable<Record>;
  sections: Record[]

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);
  sectionFormControl = new FormControl('', [
    Validators.required,
  ]);

  name: string;
  section: Record;
  rootSection = {id: CommonService.FIRST_LEVEL_ID, name: 'Основной - первый уровень'}

  constructor(
    private route: ActivatedRoute,
    private recordService: RecordService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSections()
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

  save() {
    if (this.name && this.section) {
      let sections, prefix;
      if (this.section.id === CommonService.FIRST_LEVEL_ID) {
        // Get only root level sections
        sections = this.sections.filter(sect => CommonService.isRootLevelRecord(sect))
        prefix = CommonService.SECTION_PREFIX
      } else {
        sections = this.section.sections;
        prefix = this.section.id + CommonService.SECTION_PREFIX
      }
      const newRecord: Record = {
        id: prefix + (CommonService.getLastId(sections) + 1),
        name: this.name,
        items: [],
        sections: []
      }
      this.recordService.addRecord(newRecord, this.section.id, 'sections')
      this.router.navigate(['']);
    }
  }
}
