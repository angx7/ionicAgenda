import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/User.interface';
import { ModalController } from '@ionic/angular';
import { TaskDetailModalPage } from '../task-detail-modal/task-detail-modal.page';
import { Task } from '../interfaces/Task.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: User | undefined;

  constructor(
    private router: Router,
    private modalController: ModalController
  ) {}

  async openModal(task: Task | undefined) {
    const modal = await this.modalController.create({
      component: TaskDetailModalPage,
      componentProps: { task },
    });
    return await modal.present();
  }

  logOut() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.user = navigation.extras.state['user'];
      console.log('Usuario recibido:', this.user);
      if (this.user && this.user.tasks) {
        console.log('Tareas del usuario:', this.user.tasks);
      }
    }
  }
}
