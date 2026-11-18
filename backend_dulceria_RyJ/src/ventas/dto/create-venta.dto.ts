import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDefined, IsInt, ValidateNested } from 'class-validator';
import { DetalleVentaDto } from './detalle-venta.dto';
import { PagoDto } from './pago.dto';

export class CreateVentaDto {
  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El cliente es obligatorio' })
  @IsInt({ message: 'El id del cliente debe ser tipo numérico' })
  readonly idCliente: number;

  @ApiProperty({ type: [DetalleVentaDto] })
  @IsArray({ message: 'Los detalles deben ser una lista' })
  @ArrayMinSize(1, { message: 'La venta debe tener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  readonly detalles: DetalleVentaDto[];

  @ApiProperty({ type: [PagoDto] })
  @IsArray({ message: 'Los pagos deben ser una lista' })
  @ArrayMinSize(1, { message: 'La venta debe tener al menos un pago' })
  @ValidateNested({ each: true })
  @Type(() => PagoDto)
  readonly pagos: PagoDto[];
}