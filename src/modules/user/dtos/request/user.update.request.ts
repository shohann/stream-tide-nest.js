import { PartialType } from '@nestjs/mapped-types';
import { UserSignupRequestDto } from './user.signup.request.dto';

export class UserUpdateRequestDto extends PartialType(UserSignupRequestDto) {}
