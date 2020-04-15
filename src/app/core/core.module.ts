import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    HttpClientModule,
    NgxSpinnerModule
  ],
})
export class CoreModule {}
