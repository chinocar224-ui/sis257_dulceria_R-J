import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsIn, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateMovimientoInventarioDto {
  @ApiProperty()
  @IsDefined({ message: 'El id del producto es obligatorio' })
  @IsInt({ message: 'El id del producto debe ser tipo numérico' })
  readonly idProducto: number;

  @ApiProperty({ example: 'ENTRADA', enum: ['ENTRADA', 'SALIDA'] })
  @IsNotEmpty({ message: 'El tipo es obligatorio' })
  @Transform(({ value }): string | undefined =>
    typeof value == 'string' ? value.trim().toUpperCase() : value,
  )
  @IsIn(['ENTRADA', 'SALIDA'], { message: 'El tipo debe ser ENTRADA o SALIDA' })
  readonly tipo: string;

  @ApiProperty()
  @IsDefined({ message: 'La cantidad es obligatoria' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  readonly cantidad: number;

  @ApiProperty({ example: 'Compra a proveedor' })
  @IsNotEmpty({ message: 'El motivo es obligatorio' })
  @IsString({ message: 'El motivo debe ser de tipo cadena' })
  @MaxLength(150, { message: 'El motivo no puede tener más de 150 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly motivo: string;
}