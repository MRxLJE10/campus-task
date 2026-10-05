import { Body, Controller, Get, Post, Patch, Param, HttpException } from '@nestjs/common';
import { Tarea } from './tarea.model';
import { TareasService } from './tareas.service';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) { }

  @Get()
  listar(): Promise<Tarea[]> {
    return this.tareasService.listar();
  }

  @Post()
  crear(@Body('titulo') titulo: string): Promise<Tarea> {
    return this.tareasService.crear(titulo);
  }
  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body('titulo') titulo: string,
  ): Promise<Tarea> {
    const tarea = await this.tareasService.actualizar(Number(id), titulo);
    if (!tarea) {
      throw new HttpException('Tarea no encontrada', 404);
    }
    return tarea;
  }
}
