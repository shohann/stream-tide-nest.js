import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
  Post,
  ValidationPipe,
  Body,
  HttpCode,
  Put,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';
import { UserSignupRequestDto } from './dtos/request/user.signup.request.dto';
import { UserUpdateRequestDto } from './dtos/request/user.update.request';

export class GetUserDetailsParamsDto {
  @Type(() => Number) // Transforms the value to a number
  @IsInt({ message: 'The "id" parameter must be a numeric integer' }) // Validates it as an integer
  id: number;
}

export class GetUsersQueryDto {
  @IsOptional()
  @Type(() => Number) // Converts the string to a number
  @IsInt({ message: 'Page must be a valid number' })
  page: number = 1; // Default value for page

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be a valid number' })
  limit: number = 10; // Default value for limit
}

@Controller('users')
export class UserController {
  @Get()
  getUsers(
    // @Query() query: GetUsersQueryDto
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    // console.log(typeof query.page);
    console.log(limit);
    console.log(page);
    console.log(typeof limit);
    console.log(typeof page);

    const user = [
      {
        id: 3,
        name: 'test',
        age: 23,
        gender: 'male',
      },
    ];

    return user;
  }

  @Post('/signup')
  @HttpCode(200)
  signUp(@Body(new ValidationPipe()) body: UserSignupRequestDto) {
    const user = body;

    return {
      message: `A new user has been created`,
      email: user.email,
    };
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UserUpdateRequestDto,
  ) {
    const userId = id;
    const user = body;
    console.log(user);

    return {
      message: `User with id ${userId} has been updated`,
      user,
    };
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    const userId = id;
    console.log(typeof userId);
    const user = {
      id: 3,
      name: 'test',
    };

    return user;
  }
}
