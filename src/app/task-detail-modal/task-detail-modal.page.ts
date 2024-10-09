import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-task-detail-modal',
  templateUrl: './task-detail-modal.page.html',
  styleUrls: ['./task-detail-modal.page.scss'],
})
export class TaskDetailModalPage {
  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
