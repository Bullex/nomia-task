import { NgModule } from '@angular/core';

import { HomeComponent } from './page/home.component';
import { RecordDetailsComponent } from './page/record-details/record-details.component';
import { HomeRoutingModule } from './home.routing';

import { SharedModule } from '@shared/shared.module';
import { AddSectionComponent } from '@modules/home/page/add-section/add-section.component';
import { AddItemComponent } from '@modules/home/page/add-item/add-item.component';

@NgModule({
    declarations: [
        HomeComponent,
        RecordDetailsComponent,
        AddSectionComponent,
        AddItemComponent,
    ],
    imports: [
        SharedModule,
        HomeRoutingModule
    ],
    exports: [],
    providers: [],
    entryComponents: []
})
export class HomeModule {}
