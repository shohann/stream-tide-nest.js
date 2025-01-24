import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class UserSignupRequestDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  password: string;
}
