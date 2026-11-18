import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, Min } from 'class-validator';

export class DetalleVentaDto {
  @ApiProperty({ example: 1 })
  @IsDefined({ message: 'El id del producto es obligatorio' })
  @IsInt({ message: 'El id del producto debe ser tipo numérico' })
  readonly idProducto: number;

  @ApiProperty({ example: 2 })
  @IsDefined({ message: 'La cantidad es obligatoria' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  readonly cantidad: number;
}