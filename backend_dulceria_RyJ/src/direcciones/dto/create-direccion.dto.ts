import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDireccionDto {
  @ApiProperty()
  @IsDefined({ message: 'El id del cliente es obligatorio' })
  @IsInt({ message: 'El id del cliente debe ser tipo numérico' })
  readonly idCliente: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @IsString({ message: 'La dirección debe ser de tipo cadena' })
  @MaxLength(150, { message: 'La dirección no puede tener más de 150 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly direccion: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La zona es obligatoria' })
  @IsString({ message: 'La zona debe ser de tipo cadena' })
  @MaxLength(50, { message: 'La zona no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly zona: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La referencia debe ser de tipo cadena' })
  @MaxLength(150, { message: 'La referencia no puede tener más de 150 caracteres' })
  readonly referencia?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'El campo principal debe ser verdadero o falso' })
  readonly principal?: boolean;
}