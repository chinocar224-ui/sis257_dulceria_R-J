import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: AuthLoginDto): Promise<any> {
    const { usuario, clave } = authLoginDto;
    const usuarioOk = await this.usuariosService.validate(usuario, clave);

    const payload: JwtPayload = { sub: usuarioOk.id };
    const access_token = await this.getAccessToken(payload);

    return { ...usuarioOk, access_token };
  }

  async getAccessToken(payload: JwtPayload): Promise<string> {
    type StringValue = `${number}${'s' | 'm' | 'h' | 'd'}`;
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_TOKEN ?? 'default_secret',
      expiresIn: (process.env.JWT_TOKEN_EXPIRATION ?? '8h') as StringValue,
    });
  }

  async verifyPayload(payload: JwtPayload): Promise<Usuario> {
    try {
      return await this.usuariosService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException(`Usuario inválido: ${payload.sub}`);
    }
  }
}