import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordResolver } from './record-resolver.service';
import { HomeComponent } from './page/home.component';
import { RecordDetailsComponent } from './page/record-details/record-details.component';
import { AddItemComponent } from './page/add-item/add-item.component';
import { AddSectionComponent } from './page/add-section/add-section.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'record/section',
    component: AddSectionComponent,
    pathMatch: 'full'
  },
  {
    path: 'record/item',
    component: AddItemComponent,
    pathMatch: 'full'
  },
  {
    path: 'record/:id',
    component: RecordDetailsComponent,
    resolve: {
      record: RecordResolver
    },
  },
  {
    path: 'record/:id/section',
    component: AddSectionComponent,
    resolve: {
      record: RecordResolver
    },
  },
  {
    path: 'record/:id/item',
    component: AddItemComponent,
    resolve: {
      record: RecordResolver
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
