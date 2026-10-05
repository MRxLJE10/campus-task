import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Tarea } from './tarea.model';

@Injectable()
export class TareasService {
  constructor(private db: DatabaseService) {}

  async listar(): Promise<Tarea[]> {
    const result = await this.db.query('SELECT id, titulo FROM tareas ORDER BY id');
    return result.rows as Tarea[];
  }

  async crear(titulo: string): Promise<Tarea> {
    const result = await this.db.query(
      'INSERT INTO tareas (titulo) VALUES ($1) RETURNING id, titulo',
      [titulo],
    );
    return result.rows[0] as Tarea;
  }
    async actualizar(id: number, titulo: string): Promise<Tarea> {
    const result = await this.db.query(
      'UPDATE tareas SET titulo = $1 WHERE id = $2 RETURNING id, titulo',
      [titulo, id],
    );
    return result.rows[0] as Tarea;
  }
}
