import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Task } from '../interfaces/Task.interface';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.page.html',
  styleUrls: ['./edit-task-modal.page.scss'],
})
export class EditTaskModalPage implements OnInit {
  @Input() task: Task = {
    title: '',
    frequency: '',
    time: '',
    days: [],
    completed: false,
  };
  originalTask: Task = {
    title: '',
    frequency: '',
    time: '',
    days: [],
    completed: false,
  };
  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.originalTask = { ...this.task };
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async save() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.task = { ...this.originalTask };
            this.modalController.dismiss(this.task);
          },
        },
        {
          text: 'Guardar',
          handler: () => {
            this.modalController.dismiss(this.task);
            console.log(this.task);
          },
        },
      ],
    });

    await alert.present();
    // console.log(this.task);
  }
  //this.modalController.dismiss(this.task);
  save2() {
    this.modalController.dismiss(this.task);
  }
}
