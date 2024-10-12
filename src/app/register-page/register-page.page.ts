import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/User.interface';
import { Task } from '../interfaces/Task.interface';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

interface Country {
  name: string;
  states: { name: string; state_code: string }[];
}

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.page.html',
  styleUrls: ['./register-page.page.scss'],
})
export class RegisterPagePage implements OnInit {
  countrySearchTerm: any;
  goBack() {
    this.router.navigate(['/']);
  }
  countries: Country[] = [];
  estados: { name: string; state_code: string }[] = [];
  selectedCountry: string = '';
  selectedState: string = '';
  nombre: string;
  correo: string;
  direccion: string;
  telefono: string;
  genero: string;
  fechaNacimiento: Date;
  estadoCivil: string;

  // implementación de la interfaz User.interface.ts
  users: User[] = [];
  tasks: Task[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient
  ) {
    this.nombre = '';
    this.correo = '';
    this.direccion = '';
    this.telefono = '';
    this.genero = '';
    this.fechaNacimiento = new Date();
    this.estadoCivil = '';
    this.tasks = [];
  }

  ngOnInit() {
    this.loadCountries();
  }

  // Cargar lista de países al iniciar
  loadCountries() {
    this.http
      .get('https://countriesnow.space/api/v0.1/countries/states')
      .subscribe((response: any) => {
        this.countries = response.data;
      });
  }

  // Cargar estados según el país seleccionado
  onCountryChange(event: any) {
    const selectedCountry = this.countries.find(
      (country) => country.name === event.detail.value
    );
    if (selectedCountry) {
      this.estados = selectedCountry.states;
      if (this.estados.length === 0) {
        // Si el país no tiene estados, establecer el mismo valor del país en el campo de estado
        this.selectedState = selectedCountry.name;
      } else {
        this.selectedState = '';
      }
    } else {
      this.estados = [];
      this.selectedState = '';
    }
  }

  async addUser(_t8: NgForm) {
    const defaultTask: Task = {
      id: 1,
      title: 'Tarea 1',
      frequency: 'Semanal',
      time: '12:00',
      days: ['Lunes', 'Martes'],
      completed: false,
    };

    const anotherTask: Task = {
      id: 2,
      title: 'Leer',
      frequency: 'Diario',
      time: '18:00',
      days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
      completed: false,
    };

    const newUser: User = {
      nombre: this.nombre,
      correo: this.correo,
      pais: this.selectedCountry,
      estado: this.selectedState,
      direccion: this.direccion,
      telefono: this.telefono,
      genero: this.genero,
      fechaNacimiento: this.fechaNacimiento,
      estadoCivil: this.estadoCivil,
      tasks: [defaultTask, anotherTask],
    };

    if (await this.validateUser(newUser, _t8)) {
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      this.users = users;
      const userLogg = this.correo;
      const alert = await this.alertController.create({
        header: 'Bienvenido',
        message: userLogg,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.addTaskToUser;
              this.router.navigate(['/home'], { state: { user: newUser } });
            },
          },
        ],
      });

      await alert.present();
      _t8.reset();
    }
  }

  async validateUser(newUser: User, _t8: NgForm): Promise<boolean> {
    let userFound: User[] = [];
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      userFound = JSON.parse(storedUsers);
      const found = userFound.some((user) => newUser.correo === user.correo);
      console.log(found);
      if (found) {
        const alertError = await this.alertController.create({
          header: 'Correo ya registrado',
          message:
            'El correo que estas intentando registrar ya existe, inicia sesión',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                _t8.reset();
              },
            },
          ],
        });

        await alertError.present();
        return false;
      }
    }
    return true;
  }

  addTaskToUser(email: string, task: Task) {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.correo === email);
    if (user) {
      user.tasks.push(task);
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
}
