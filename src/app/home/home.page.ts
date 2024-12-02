import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  SearchbarInputEventDetail,
} from '@ionic/angular';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { TaskDetailModalPage } from '../task-detail-modal/task-detail-modal.page';
import { EditTaskModalPage } from '../edit-task-modal/edit-task-modal.page';
import { NewTaskModalPage } from '../new-task-modal/new-task-modal.page';
import { User } from '../interfaces/User.interface';
import { Task } from '../interfaces/Task.interface';
import { Share } from '@capacitor/share';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User | undefined;
  filteredTasks: Task[] = [];
  searchQuery: string = '';
  filterCategory: string = 'Todas';
  categories: string[] = ['Trabajo', 'Estudio', 'Personal'];
  connectionStatus: string = 'Sin conexión a internet'; // Mensaje inicial
  private syncTimeout: any; // Timeout para ocultar el mensaje de sincronización
  showHeader: boolean = true; // Controla la visibilidad del encabezado
  headerClass: string = 'offline'; // Clase CSS para el encabezado
  syncOnMobileData: boolean = true; // Preferencia del usuario para sincronizar con datos móviles

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.user = navigation.extras.state['user'];
      if (this.user && this.user.tasks) {
        this.loadUserTasks();
      }
    }
    // Cargar la preferencia del usuario
    try {
      const { value } = await Preferences.get({ key: 'syncOnMobileData' });
      this.syncOnMobileData = value === 'true';
      console.log('Preferencia cargada:', this.syncOnMobileData);
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
    }

    this.updateConnectionStatus();

    Network.addListener('networkStatusChange', (status) => {
      this.showHeader = false;
      clearTimeout(this.syncTimeout);
      console.log('Cambio de estado de conexión:', status.connected);
    });
  }

  async shareEvent(_t51: Task) {
    try {
      await Share.share({
        title: _t51.title, // El título del evento
        text: `Título del evento: ${_t51.title}\nDescripción: ${_t51.description}\nLugar: ${_t51.location}\nFecha: ${_t51.date}\nHora: ${_t51.time}`, // La descripción del evento con lugar, fecha y hora
        url: '', // Si no tienes una URL para compartir, puedes dejarlo vacío
        dialogTitle: 'Compartir evento', // Título del cuadro de diálogo de compartir
      });

      console.log('Evento compartido exitosamente');
    } catch (error) {
      console.error('Error al compartir el evento:', error);
    }
  }

  searchEvents($event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
    this.searchQuery = $event.detail.value ?? '';
    this.applyFilters();
  }

  /**
   * Combina los filtros de búsqueda y categorías para actualizar las tareas filtradas.
   */
  applyFilters() {
    if (!this.user || !this.user.tasks) {
      this.filteredTasks = [];
      return;
    }

    let tasks = this.user.tasks;

    // Filtro por categoría
    if (this.filterCategory && this.filterCategory !== 'Todas') {
      tasks = tasks.filter((task) =>
        task.category.includes(this.filterCategory)
      );
    }

    // Filtro por búsqueda
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase();
      tasks = tasks.filter((task) => task.title.toLowerCase().includes(query));
    }
    // Ordenar por fecha (del más próximo al más lejano)
    tasks.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    this.filteredTasks = tasks;
  }

  /**
   * Actualiza la lista de tareas del usuario desde el almacenamiento local.
   */
  loadUserTasks() {
    if (this.user) {
      const storedUsers = localStorage.getItem('users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = users.findIndex(
        (user) => user.correo === this.user?.correo
      );
      if (userIndex !== -1) {
        this.user.tasks = users[userIndex].tasks;
        this.applyFilters();
      }
    }
  }

  /**
   * Abre el modal de detalles de la tarea.
   */
  async openTaskDetailModal(event: Event, task: Task) {
    event.stopPropagation();

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

  /**
   * Abre el modal para añadir una nueva tarea.
   */
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

  /**
   * Abre el modal para editar una tarea existente.
   */
  async openEditModal(event: Event, task: Task) {
    event.stopPropagation();

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

  /**
   * Actualiza una tarea y sincroniza los cambios con el almacenamiento local.
   */
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
      this.applyFilters();
      this.updateLocalStorage();
    }
  }

  /**
   * Sincroniza las tareas con el almacenamiento local.
   */
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

  /**
   * Elimina una tarea después de confirmarlo.
   */
  async confirmRemoveTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Eliminar tarea',
      message: '¿Estás seguro de que deseas eliminar esta tarea?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
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

  /**
   * Elimina una tarea y actualiza la lista.
   */
  deleteTask(task: Task) {
    if (this.user) {
      this.user.tasks = this.user.tasks.filter((t) => t.id !== task.id);
      this.applyFilters();
      this.updateLocalStorage();
    }
  }

  /**
   * Cierra sesión y redirige al inicio.
   */
  async logOut() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
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
  // Actualiza el mensaje según el estado de conexión
  private async updateConnectionStatus() {
    // Limpiar cualquier timeout previo
    clearTimeout(this.syncTimeout);
    const status = await Network.getStatus();

    if (status.connectionType === 'cellular' && !this.syncOnMobileData) {
      this.connectionStatus = 'Sincronización desactivada con datos';
      this.headerClass = 'offline';
    } else if (
      status.connectionType === 'wifi' ||
      status.connectionType === 'cellular'
    ) {
      this.connectionStatus = 'Sincronizando datos';
      this.headerClass = 'syncing';
    } else {
      this.connectionStatus = 'No hay conexión a internet';
      this.headerClass = 'offline';
    }

    // Mostrar encabezado y configurar timeout para ocultarlo
    this.showHeader = true;
    console.log('Clase aplicada:', this.headerClass);
    console.log(this.connectionStatus);

    this.syncTimeout = setTimeout(() => {
      this.showHeader = false;
    }, 5000);
  }
  // }
  // Guardar la preferencia del usuario
  async toggleSyncOnMobileData(event: any) {
    this.syncOnMobileData = event.detail.checked;
    console.log('syncOnMobileData actualizado:', this.syncOnMobileData);
    await Preferences.set({
      key: 'syncOnMobileData',
      value: this.syncOnMobileData.toString(),
    });

    this.updateConnectionStatus();
  }

  async syncData() {
    console.log('syncmobiledata:', this.syncOnMobileData);
    this.updateConnectionStatus();
  }

  ngOnDestroy() {
    // Limpia el timeout cuando el componente se destruye
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
  }
}
