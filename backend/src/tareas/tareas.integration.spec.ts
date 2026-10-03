import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';
import { DatabaseService } from '../database/database.service';

describe('Tareas (integration)', () => {
  let app: any;
  const query = jest.fn();

  beforeEach(async () => {
    query.mockReset();

    const module = await Test.createTestingModule({
      controllers: [TareasController],
      providers: [
        TareasService,
        { provide: DatabaseService, useValue: { query } as any },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('GET /tareas devuelve 200 con las tareas', async () => {
    const tareas = [{ id: 1, titulo: 'Tarea 1' }];
    query.mockResolvedValue({ rows: tareas });

    const response = await request(app.getHttpServer()).get('/tareas');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(tareas);
  });

  it('POST /tareas devuelve 201 con la tarea creada', async () => {
    const creada = { id: 1, titulo: 'Nueva tarea' };
    query.mockResolvedValue({ rows: [creada] });

    const response = await request(app.getHttpServer())
      .post('/tareas')
      .send({ titulo: 'Nueva tarea' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(creada);
    expect(query).toHaveBeenCalledWith(
      'INSERT INTO tareas (titulo) VALUES ($1) RETURNING id, titulo',
      ['Nueva tarea'],
    );
  });

  it('PATCH /tareas/:id devuelve 200 con la tarea actualizada', async () => {
    const actualizada = { id: 1, titulo: 'Tarea actualizada' };
    query.mockResolvedValue({ rows: [actualizada] });

    const response = await request(app.getHttpServer())
      .patch('/tareas/1')
      .send({ titulo: 'Tarea actualizada' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(actualizada);
    expect(query).toHaveBeenCalledWith(
      'UPDATE tareas SET titulo = $1 WHERE id = $2 RETURNING id, titulo',
      ['Tarea actualizada', 1],
    );
  });

  it('PATCH /tareas/:id devuelve 404 si la tarea no existe', async () => {
    query.mockResolvedValue({ rows: [] });

    const response = await request(app.getHttpServer())
      .patch('/tareas/999')
      .send({ titulo: 'Tarea actualizada' });

    expect(response.status).toBe(404);
  });
});