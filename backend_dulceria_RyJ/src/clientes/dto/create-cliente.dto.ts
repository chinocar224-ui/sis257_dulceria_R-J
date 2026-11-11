import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: 'El id del usuario debe ser tipo numérico' })
  readonly idUsuario?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El CI/NIT es obligatorio' })
  @IsString({ message: 'El CI/NIT debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El CI/NIT no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly ciNit: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Los nombres son obligatorios' })
  @IsString({ message: 'Los nombres deben ser de tipo cadena' })
  @MaxLength(50, { message: 'Los nombres no pueden tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nombres: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  @IsString({ message: 'Los apellidos deben ser de tipo cadena' })
  @MaxLength(50, { message: 'Los apellidos no pueden tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly apellidos: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser de tipo cadena' })
  @MaxLength(15, { message: 'El teléfono no puede tener más de 15 caracteres' })
  readonly telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(50, { message: 'El email no puede tener más de 50 caracteres' })
  readonly email?: string;
}