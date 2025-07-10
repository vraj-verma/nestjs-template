import {
  Post,
  Body,
  Controller,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Utility } from '../utils/utils';
import { ROLES } from '../enums/roles.enum';
import { SignupDTO } from './dto/signup.dto';
import { SigninDTO } from './dto/signin.dto';
import { STATUS } from '../enums/status.enum';
import { DatabaseService } from '../db/db.service';
import { CustomValidationPipe } from '../pipes/validation.pipe';
import { JoiValidationSchema } from '../validations/payload.validation';
import { ACCOUNT_COL, USER_COL } from '../constants/collections.constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly utils: Utility,
    private readonly databaseService: DatabaseService
  ) { }


  @ApiOperation(
    {
      summary: 'Register yourself',
      description: 'Create account with email & password'
    }
  )
  @Post('signup')
  async signup(
    @Body(new CustomValidationPipe(JoiValidationSchema.signupSchema)) payload: SignupDTO
  ) {

    const findOneArgs = { email: payload.email };

    const alreadyExist = await this.databaseService.FindOne(USER_COL, findOneArgs);

    if (alreadyExist) {
      throw new HttpException(
        `User with email: ${payload.email} already exist, please login`,
        HttpStatus.CONFLICT
      );
    }

    // create account
    const accPayload = {
      status: STATUS.ACTIVE,
      address: payload.address || {},
    };

    const account: any = await this.databaseService.InsertOne(ACCOUNT_COL, accPayload, "accountId");

    if (!account) {
      throw new HttpException(
        `Unable to create account, please try again.`,
        HttpStatus.NOT_IMPLEMENTED
      );
    }

    // hash password
    payload.password = await this.utils.encryptStr(payload.password, 10);

    // create user
    const userPayload = {
      accountId: account.accountId,
      email: payload.email,
      name: payload.name,
      password: payload.password,
      status: STATUS.ACTIVE,
      role: ROLES.ADMIN
    };

    const user = await this.databaseService.InsertOne(USER_COL, userPayload, 'userId');

    if (!user) {
      throw new HttpException(
        `Unable to create user, please try again.`,
        HttpStatus.NOT_IMPLEMENTED
      );
    }

    return {
      status: true,
      response: `Registration successfully!`
    };

  }


  @ApiOperation(
    {
      summary: 'Signin with valid email & password',
      description: 'Signin & get JWT token for further access'
    }
  )
  @Post('signin')
  async signin(
    @Body(new CustomValidationPipe(JoiValidationSchema.signinSchema)) payload: SigninDTO
  ) {

    const user = await this.databaseService.FindOne(USER_COL, { email: payload.email });

    if (!user) {
      throw new HttpException(
        `User with email: ${payload.email} does not exist`,
        HttpStatus.NOT_FOUND
      );
    }

    const decodedPass = await this.utils.decryptStr(payload.password, user.password);

    if (!decodedPass) {
      throw new HttpException(
        `Incorrect password`,
        HttpStatus.BAD_REQUEST
      );
    }

    const jwtPayload = {
      userId: user.userId,
      accountId: user.accountId,
      email: user.email,
      role: user.role
    }

    const token = await this.utils.signJWT(jwtPayload);

    return {
      status: true,
      response: `Logged in successfully`,
      token
    }
  }

}
