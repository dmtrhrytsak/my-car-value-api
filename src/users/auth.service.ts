import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BinaryLike, randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrpyt: (
  arg1: BinaryLike,
  arg2: BinaryLike,
  arg3: number,
) => Promise<Buffer> = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email in use
    const candidate = await this.usersService.findByEmail(email);

    if (candidate) {
      throw new BadRequestException(`Email ${email} in use`);
    }

    const salt = randomBytes(8).toString('hex');

    const hash = await scrpyt(password, salt, 32);

    const hashPassword = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, hashPassword);

    return user;
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = await scrpyt(password, salt, 32);

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Incorret password');
    }

    return user;
  }
}
