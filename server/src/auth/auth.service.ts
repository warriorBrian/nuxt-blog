import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async sign (payload) {
    return this.jwtService.sign(payload);
  }
  async validate (token) {
    const res = this.jwtService.verify(token);
    console.log(res, 'res');
  }
}
