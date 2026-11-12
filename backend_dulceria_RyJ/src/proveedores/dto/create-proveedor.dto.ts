import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'La razón social es obligatoria' })
  @IsString({ message: 'La razón social debe ser de tipo cadena' })
  @MaxLength(100, { message: 'La razón social no puede tener más de 100 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly razonSocial: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El NIT es obligatorio' })
  @IsString({ message: 'El NIT debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El NIT no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nit: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString({ message: 'El teléfono debe ser de tipo cadena' })
  @MaxLength(15, { message: 'El teléfono no puede tener más de 15 caracteres' })
  readonly telefono: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La dirección debe ser de tipo cadena' })
  @MaxLength(150, { message: 'La dirección no puede tener más de 150 caracteres' })
  readonly direccion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(50, { message: 'El email no puede tener más de 50 caracteres' })
  readonly email?: string;
}