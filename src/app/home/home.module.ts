import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import {NgCircleProgressModule} from '../circle-progress/circle-progress.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    NgCircleProgressModule.forRoot({
      // set defaults here
      responsive: true,
      renderOnClick: false
    }),
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
