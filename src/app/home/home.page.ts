import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/User.interface';
import { AlertController, ModalController } from '@ionic/angular';
import { TaskDetailModalPage } from '../task-detail-modal/task-detail-modal.page';
import { Task } from '../interfaces/Task.interface';
import { EditTaskModalPage } from '../edit-task-modal/edit-task-modal.page';
import { NewTaskModalPage } from '../new-task-modal/new-task-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: User | undefined;
  filteredTasks: Task[] = [];
  filter: string = 'todas';
  completionPercentage: number = 0;
  progressBar: number = 0;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.user = navigation.extras.state['user'];
      if (this.user && this.user.tasks) {
        this.applyFilter();
      }
    }
    this.loadUserTasks();
    this.reorderTask();
  }

  applyFilter() {
    if (this.user && this.user.tasks) {
      if (this.filter === 'Semanal') {
        this.filteredTasks = this.user.tasks.filter(
          (task) => task.frequency === 'Semanal'
        );
        this.reorderTask();
      } else if (this.filter === 'Mensual') {
        this.filteredTasks = this.user.tasks.filter(
          (task) => task.frequency === 'Mensual'
        );
        this.reorderTask();
      } else {
        this.filteredTasks = this.user.tasks;
        this.reorderTask();
      }
      this.reorderTask();
      this.calculateCompletionPercentage();
    }
  }

  calculateCompletionPercentage() {
    if (this.filteredTasks.length === 0) {
      this.completionPercentage = 0;
      this.progressBar = 0;
      return;
    }
    const completedTasks = this.filteredTasks.filter(
      (task) => task.completed
    ).length;
    this.completionPercentage =
      (completedTasks / this.filteredTasks.length) * 100;
    this.progressBar = completedTasks / this.filteredTasks.length;
  }

  // Detalles de tarea
  async openTaskDetailModal(event: Event, task: Task | undefined) {
    event.stopPropagation();

    const modal = await this.modalController.create({
      component: TaskDetailModalPage,
      componentProps: { task, userCorreo: this.user?.correo },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.updateTask(data.data);
        this.reorderTask();
      }
    });
    return await modal.present();
  }

  async addTask() {
    const modal = await this.modalController.create({
      component: NewTaskModalPage,
      componentProps: { userCorreo: this.user?.correo },
    });
    modal.onDidDismiss().then(() => {
      this.loadUserTasks();
      this.reorderTask();
    });
    return await modal.present();
  }

  loadUserTasks() {
    if (this.user) {
      const storedUsers = localStorage.getItem('users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = users.findIndex(
        (user) => user.correo === this.user?.correo
      );
      if (userIndex !== -1) {
        this.user.tasks = users[userIndex].tasks;
        this.applyFilter();
      }
    }
    this.reorderTask();
  }

  reorderTask() {
    this.user?.tasks.sort((a, b) => {
      return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
    });
  }

  setFilter(filter: string) {
    this.filter = filter;
    this.applyFilter();
  }

  async openEditModal(event: Event, task: Task) {
    event.stopPropagation();

    const modal = await this.modalController.create({
      component: EditTaskModalPage,
      componentProps: { task, userCorreo: this.user?.correo },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.updateTask(data.data);
        this.reorderTask();
      }
    });
    return await modal.present();
  }

  updateTask(updatedTask: Task) {
    if (this.user) {
      const taskIndex = this.user.tasks.findIndex(
        (task) => task.id === updatedTask.id
      );
      if (taskIndex !== -1) {
        this.user.tasks[taskIndex] = updatedTask;
      } else {
        this.user.tasks.push(updatedTask);
      }
      this.applyFilter();
      this.updateLocalStorage();
    }
  }

  updateLocalStorage() {
    if (this.user) {
      const storedUsers = localStorage.getItem('users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = users.findIndex(
        (user) => user.correo === this.user?.correo
      );
      if (userIndex !== -1) {
        users[userIndex].tasks = this.user.tasks;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  }

  async logOut() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.router.navigate(['/']);
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmRemoveTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Eliminar hábito',
      message: '¿Estas seguro de que deseas eliminar este hábito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteTask(task);
          },
        },
      ],
    });

    await alert.present();
  }

  deleteTask(task: Task | undefined) {
    if (this.user && task) {
      const taskIndex = this.user.tasks.findIndex((t) => t.id === task.id);
      if (taskIndex !== -1) {
        this.user.tasks.splice(taskIndex, 1);

        // Update localStorage
        const data = localStorage.getItem('users');
        if (data) {
          const users: User[] = JSON.parse(data);
          const currentUserIndex = users.findIndex(
            (user) => user.correo === this.user?.correo
          );
          if (currentUserIndex !== -1) {
            users[currentUserIndex].tasks = this.user.tasks;
            localStorage.setItem('users', JSON.stringify(users));
            this.loadUserTasks();
          }
        }
      }
    }
  }
}
