import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsDefined({ message: 'El id de la categoría es obligatorio' })
  @IsInt({ message: 'El id de la categoría debe ser tipo numérico' })
  readonly idCategoria: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: 'El id del proveedor debe ser tipo numérico' })
  readonly idProveedor?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El código no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined =>
    typeof value == 'string' ? value.trim().toUpperCase() : value,
  )
  readonly codigo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nombre: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La descripción debe ser de tipo cadena' })
  @MaxLength(250, { message: 'La descripción no puede tener más de 250 caracteres' })
  readonly descripcion?: string;

  @ApiProperty()
  @IsDefined({ message: 'El precio es obligatorio' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  readonly precio: number;

  @ApiProperty()
  @IsDefined({ message: 'El stock es obligatorio' })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  readonly stock: number;

  @ApiPropertyOptional({ example: '2027-06-30' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de vencimiento debe tener formato AAAA-MM-DD' })
  readonly fechaVencimiento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La imagen debe ser de tipo cadena' })
  @MaxLength(255, { message: 'La URL de la imagen no puede tener más de 255 caracteres' })
  readonly imagen?: string;
}