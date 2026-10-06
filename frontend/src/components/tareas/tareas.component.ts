import { Component, OnInit, inject, signal } from '@angular/core';
import { Tarea } from './tarea.model';
import { TareasService } from './tareas.service';

@Component({
  selector: 'app-tareas',
  standalone: true,
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css',
})
export class TareasComponent implements OnInit {
  private readonly tareasService = inject(TareasService);
  tareas = signal<Tarea[]>([]);
  editandoId = signal<number | null>(null);

  ngOnInit(): void {
    this.tareasService.listar().subscribe((tareas) => {
      this.tareas.set(tareas);
    });
  }
  crear(titulo: string) {
    this.tareasService.crear(titulo).subscribe((tarea) => {
      this.tareas.update((tareas) => [...tareas, tarea]);
    });
  }
  editar(id: number) {
    this.editandoId.set(id);
  }
  actualizar(id: number, titulo: string) {
    this.tareasService.actualizar(id, titulo).subscribe((tarea) => {
      this.tareas.update((tareas) => tareas.map((t) => (t.id === id ? tarea : t)));
      this.editandoId.set(null);
    });
  }
  eliminar(id: number) {
    this.tareasService.eliminar(id).subscribe(() => {
      this.tareas.update((tareas) => tareas.filter((t) => t.id !== id));
    });
  }

}
