import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength } from 'class-validator';
export class PagoDto {
  @ApiProperty({ example: 'EFECTIVO', enum: ['EFECTIVO', 'QR', 'TARJETA'] })
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  @Transform(({ value }): string | undefined =>
    typeof value == 'string' ? value.trim().toUpperCase() : value,
  )
  @IsIn(['EFECTIVO', 'QR', 'TARJETA'], { message: 'El método debe ser EFECTIVO, QR o TARJETA' })
  readonly metodo: string;

  @ApiProperty({ example: 50 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El monto debe ser un número con máximo 2 decimales' })
  @IsPositive({ message: 'El monto debe ser mayor a 0' })
  @Max(10000, { message: 'El monto no puede ser mayor a Bs. 10.000' })
  readonly monto: number;;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La referencia debe ser de tipo cadena' })
  @MaxLength(50, { message: 'La referencia no puede tener más de 50 caracteres' })
  readonly referencia?: string;
}