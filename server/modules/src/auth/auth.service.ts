import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async sign (payload) {
    return this.jwtService.sign(payload);
  }
  async validate (token) {
    return await this.jwtService.verify(token);
  }
}
