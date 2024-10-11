import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTaskModalPageRoutingModule } from './edit-task-modal-routing.module';

import { EditTaskModalPage } from './edit-task-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTaskModalPageRoutingModule
  ],
  declarations: [EditTaskModalPage]
})
export class EditTaskModalPageModule {}
