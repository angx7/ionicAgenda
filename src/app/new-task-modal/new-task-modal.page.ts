import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from '../interfaces/Task.interface';
import { User } from '../interfaces/User.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.page.html',
  styleUrls: ['./new-task-modal.page.scss'],
})
export class NewTaskModalPage implements OnInit {
  async checkPermissions() {
    try {
      const cameraStatus = await Camera.checkPermissions();

      if (
        cameraStatus.camera !== 'granted' ||
        cameraStatus.photos !== 'granted'
      ) {
        const result = await Camera.requestPermissions({
          permissions: ['camera', 'photos'],
        });

        if (result.camera !== 'granted' || result.photos !== 'granted') {
          console.error('Permisos de cámara/galería no otorgados');
        } else {
          console.log('Permisos de cámara y galería otorgados');
        }
      } else {
        console.log('Permisos ya otorgados');
      }
    } catch (error) {
      console.error('Error al verificar o solicitar permisos:', error);
    }
  }

  async takePicture() {
    try {
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
    } catch (error) {
      console.error('Error al capturar la imagen:', error);
    }
  }
  async selectPicture() {
    try {
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
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  }
  @Input() userCorreo: string | undefined;
  task: Task = {
    id: 0,
    title: '',
    description: '',
    date: new Date(),
    time: '',
    location: '',
    category: [],
    image: '',
  };

  constructor(private modalController: ModalController) {}
  ngOnInit(): void {
    this.checkPermissions();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  saveTask() {
    if (this.userCorreo) {
      const storedUsers = localStorage.getItem('users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      const userIndex = users.findIndex(
        (user) => user.correo === this.userCorreo
      );
      if (userIndex !== -1) {
        const user = users[userIndex];

        this.task.id = user.tasks.length
          ? user.tasks[user.tasks.length - 1].id + 1
          : 1;
        user.tasks.push(this.task);

        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        this.dismissModal();
      } else {
        console.error('User not found');
      }
    } else {
      console.error('No user email provided');
    }
  }
}
