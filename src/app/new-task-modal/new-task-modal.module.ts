import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTaskModalPageRoutingModule } from './new-task-modal-routing.module';

import { NewTaskModalPage } from './new-task-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewTaskModalPageRoutingModule
  ],
  declarations: [NewTaskModalPage]
})
export class NewTaskModalPageModule {}
