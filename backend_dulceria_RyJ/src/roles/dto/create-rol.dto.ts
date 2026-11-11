import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRolDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser de tipo cadena' })
  @MaxLength(30, { message: 'El nombre no puede tener más de 30 caracteres' })
  @Transform(({ value }): string | undefined =>
    typeof value == 'string' ? value.trim().toUpperCase() : value,
  )
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser de tipo cadena' })
  @MaxLength(100, { message: 'La descripción no puede tener más de 100 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly descripcion: string;
}