import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSegment, IonSegmentButton, IonLabel,
  IonGrid, IonRow, IonCol,
  IonFab, IonFabButton, IonIcon, IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { PerrosService, Perro } from '../../services/perros.service';
import { TarjetaPerroComponent } from '../../components/tarjeta-perro/tarjeta-perro.component';

@Component({
  selector: 'app-galeria',
  templateUrl: 'galeria.page.html',
  styleUrls: ['galeria.page.scss'],
  standalone: true,
  imports: [
    FormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSegment, IonSegmentButton, IonLabel,
    IonGrid, IonRow, IonCol,
    IonFab, IonFabButton, IonIcon, IonSpinner,
    TarjetaPerroComponent,
  ],
})
export class GaleriaPage implements ViewWillEnter {
  private servicio = inject(PerrosService);
  filtro: 'todos' | 'disponibles' | 'adoptados' = 'todos';
  cargando = false;
  private todos: Perro[] = [];

  constructor() {
    addIcons({ add });
  }

  async ionViewWillEnter() {
    await this.cargar();
  }

  private async cargar() {
    this.cargando = this.todos.length === 0;
    this.todos = await this.servicio.todas();
    this.cargando = false;
  }

  get perros(): Perro[] {
    if (this.filtro === 'disponibles') return this.todos.filter((p) => !p.adoptado);
    if (this.filtro === 'adoptados') return this.todos.filter((p) => p.adoptado);
    return this.todos;
  }

  get totalTodos(): number { return this.todos.length; }
  get totalDisponibles(): number { return this.todos.filter((p) => !p.adoptado).length; }
  get totalAdoptados(): number { return this.todos.filter((p) => p.adoptado).length; }
}
