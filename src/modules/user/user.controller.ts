import { Controller, Get, Query, Param } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';

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
  getUsers(@Query() query: GetUsersQueryDto) {
    console.log(typeof query.page);

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

  @Get(':id')
  getUserById(@Param() params: GetUserDetailsParamsDto) {
    const id = params.id;
    console.log(typeof id);
    const user = {
      id: 3,
      name: 'test',
    };

    return user;
  }
}
