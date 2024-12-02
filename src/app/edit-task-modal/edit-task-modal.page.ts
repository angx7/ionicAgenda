import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Task } from '../interfaces/Task.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.page.html',
  styleUrls: ['./edit-task-modal.page.scss'],
})
export class EditTaskModalPage implements OnInit {
  @Input() task: Task = {
    id: 0,
    title: '',
    description: '',
    time: '',
    date: new Date(),
    location: '',
    category: [],
    image: '',
  };
  originalTask: Task = {
    id: 0,
    title: '',
    description: '',
    time: '',
    date: new Date(),
    location: '',
    category: [],
    image: '',
  };

  @Input() userCorreo: string | undefined;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  async chooseFromGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, // Retorna la imagen como Base64
      source: CameraSource.Photos, // Abre la galería
    });

    if (image.dataUrl) {
      this.task.image = image.dataUrl; // Guarda la imagen como parte de la tarea
      console.log(
        'Imagen seleccionada y almacenada en la tarea:',
        this.task.image
      );
    }
  }
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, // Retorna la imagen como Base64
      source: CameraSource.Camera, // Abre la cámara
    });

    if (image.dataUrl) {
      this.task.image = image.dataUrl; // Guarda la imagen como parte de la tarea
      console.log(
        'Imagen capturada y almacenada en la tarea:',
        this.task.image
      );
    }
  }

  ngOnInit() {
    this.originalTask = { ...this.task };
    console.log(
      'Correo del usuario recibido en EditTaskModalPage:',
      this.userCorreo
    );
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
