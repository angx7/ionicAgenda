import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailModalPageRoutingModule } from './task-detail-modal-routing.module';

import { TaskDetailModalPage } from './task-detail-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailModalPageRoutingModule
  ],
  declarations: [TaskDetailModalPage]
})
export class TaskDetailModalPageModule {}
