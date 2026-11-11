import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsDefined({ message: 'El id del rol es obligatorio' })
  @IsInt({ message: 'El id del rol debe ser tipo numérico' })
  readonly idRol: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Los nombres son obligatorios' })
  @IsString({ message: 'Los nombres deben ser de tipo cadena' })
  @MaxLength(100, { message: 'Los nombres no pueden tener más de 100 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nombres: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @IsString({ message: 'El usuario debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El usuario no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined =>
    typeof value == 'string' ? value.trim().toLowerCase() : value,
  )
  readonly usuario: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La clave es obligatoria' })
  @IsString({ message: 'La clave debe ser de tipo cadena' })
  @MinLength(6, { message: 'La clave debe tener al menos 6 caracteres' })
  readonly clave: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(50, { message: 'El email no puede tener más de 50 caracteres' })
  readonly email: string;
}