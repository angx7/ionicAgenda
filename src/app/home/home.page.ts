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

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.user = navigation.extras.state['user'];
      console.log('Usuario recibido:', this.user);
      if (this.user && this.user.tasks) {
        console.log('Tareas del usuario:', this.user.tasks);
        this.applyFilter();
      }
    }
    this.loadUserTasks();
  }

  applyFilter() {
    if (this.user && this.user.tasks) {
      if (this.filter === 'Semanal') {
        this.filteredTasks = this.user.tasks.filter(
          (task) => task.frequency === 'Semanal'
        );
      } else if (this.filter === 'Mensual') {
        this.filteredTasks = this.user.tasks.filter(
          (task) => task.frequency === 'Mensual'
        );
      } else {
        this.filteredTasks = this.user.tasks;
      }
    }
  }

  // Detalles de tarea
  async openTaskDetailModal(event: Event, task: Task | undefined) {
    event.stopPropagation();
    const data = localStorage.getItem('users');
    if (data) {
      const users: User[] = JSON.parse(data);
      const currentUser = users.find(
        (user) => user.correo === this.user?.correo
      );
      if (currentUser) {
        console.log('Correo del usuario loggeado:', currentUser.correo);
      } else {
        console.log('Usuario no encontrado');
      }
    } else {
      console.log('No hay usuarios en el localStorage');
    }

    const modal = await this.modalController.create({
      component: TaskDetailModalPage,
      componentProps: { task, userCorreo: this.user?.correo },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.updateTask(data.data);
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
    });
    return await modal.present();
  }
  loadUserTasks1() {
    if (this.user) {
      const storedUsers = localStorage.getItem('users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = users.findIndex(
        (user) => user.correo === this.user?.correo
      );
      if (userIndex !== -1) {
        this.user.tasks = users[userIndex].tasks;
      }
    }
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
  }
  setFilter(filter: string) {
    this.filter = filter;
    this.applyFilter();
  }
  async openEditModal(event: Event, task: Task) {
    event.stopPropagation();
    const data = localStorage.getItem('users');
    if (data) {
      const users: User[] = JSON.parse(data);
      const currentUser = users.find(
        (user) => user.correo === this.user?.correo
      );
      if (currentUser) {
        console.log('Correo del usuario loggeado:', currentUser.correo);
      } else {
        console.log('Usuario no encontrado');
      }
    } else {
      console.log('No hay usuarios en el localStorage');
    }

    const modal = await this.modalController.create({
      component: EditTaskModalPage,
      componentProps: { task, userCorreo: this.user?.correo },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.updateTask(data.data);
      }
    });
    return await modal.present();
  }

  updateTask1(updatedTask: Task) {
    if (this.user) {
      const taskIndex = this.user.tasks.findIndex(
        (task) => task.id === updatedTask.id
      );
      if (taskIndex !== -1) {
        this.user.tasks[taskIndex] = updatedTask;
      } else {
        this.user.tasks.push(updatedTask);
      }
    }
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

  async confirmRemoveTask(event: Event, task: Task) {
    event.stopPropagation();
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
        console.log(`Task with id ${task.id} deleted successfully.`);

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
            console.log('LocalStorage updated successfully.');
          } else {
            console.log('Current user not found in localStorage.');
          }
        } else {
          console.log('No users found in localStorage.');
        }
      } else {
        console.log(`Task with id ${task.id} not found.`);
      }
    } else {
      console.log('User or task is undefined.');
    }
  }
}
