import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  Session,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async signup(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(dto.email, dto.password);

    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(dto.email, dto.password);

    session.userId = user.id;

    return user;
  }

  @Post('/signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get()
  findAllUsers() {
    return this.userService.findAll();
  }

  @Get('/:id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.find(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  @Delete('/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }
}
