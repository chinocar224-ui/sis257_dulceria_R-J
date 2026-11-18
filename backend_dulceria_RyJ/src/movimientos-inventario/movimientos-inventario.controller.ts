import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Usuario } from '../usuarios/entities/usuario.entity';

@ApiTags('movimientos-inventario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('movimientos-inventario')
export class MovimientosInventarioController {
  constructor(private readonly movimientosService: MovimientosInventarioService) {}

  @Post()
  create(@Body() dto: CreateMovimientoInventarioDto, @Req() req: { user: Usuario }) {
    return this.movimientosService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.movimientosService.findAll();
  }

  @Get('producto/:idProducto')
  findByProducto(@Param('idProducto') idProducto: string) {
    return this.movimientosService.findByProducto(+idProducto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimientosService.findOne(+id);
  }
}