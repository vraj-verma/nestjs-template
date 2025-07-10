import {

  Body,
  Post,
  Req,
  Get,
  Put,
  Query,
  Delete,
  UseGuards,
  Controller,
  HttpStatus,
  HttpException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Utility } from '../utils/utils';
import { STATUS } from '../enums/status.enum';
import { Users } from '../schema/users.schema';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { DatabaseService } from '../db/db.service';
import { Pagination } from '../types/pagination.type';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { USER_COL } from '../constants/collections.constants';
import { CustomValidationPipe } from '../pipes/validation.pipe';
import { JoiValidationSchema } from '../validations/payload.validation';
import { ROLES } from '../enums/roles.enum';

@ApiTags('Users Controller')
@ApiBearerAuth()
@UseGuards(JWTAuthGuard)
@Controller('users')
export class UsersController {

  constructor(
    private readonly utils: Utility,
    private readonly databaseService: DatabaseService,

  ) { }


  @ApiOperation(
    {
      summary: 'Add user',
      description: 'Add new user with email & dummy password'
    }
  )
  @Post()
  async add(
    @Req() req,
    @Body(new CustomValidationPipe(JoiValidationSchema.addUserchema)) payload: Users
  ) {

    const { accountId } = req.user;

    const user = await this.databaseService.FindOne(USER_COL, { email: payload.email });

    if (user) {
      throw new HttpException(
        `User with email: ${payload.email} already exist.`,
        HttpStatus.CONFLICT
      );
    }

    payload.password = await this.utils.encryptStr(payload.password);

    const newUserPayload = {
      accountId,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      status: STATUS.ACTIVE,
    };

    const response = await this.databaseService.InsertOne(USER_COL, newUserPayload, "userId");

    if (!response) {
      throw new HttpException(
        `Unable to add new user, please try again later.`,
        HttpStatus.NOT_IMPLEMENTED
      );
    }

    return {
      status: true,
      response: `User Addedd!`
    }

  }


  @ApiOperation(
    {
      summary: 'Get user(s) list',
      description: 'Get all the associated user list under your account'
    }
  )
  @Get()
  async list(
    @Req() req,
    @Query(new CustomValidationPipe(JoiValidationSchema.Pagination)) pagination: Pagination
  ) {

    const { accountId } = req.user;

    const users = await this.databaseService.FindMany(
      USER_COL,
      {
        accountId
      },
      {
        projection: {
          password: 0,
          __v: 0
        },
        sort: {
          createdAt: -1
        },
        skip: ((pagination.offset - 1) * pagination.limit),
        limit: pagination.limit
      }
    );

    if (!users) {
      throw new HttpException(
        `Nodata found`,
        HttpStatus.NOT_FOUND
      )
    }

    let total = users.length;

    if (pagination.offset >= 0 || total >= pagination.limit) {
      total = await this.databaseService.Count(USER_COL, { accountId });
    }

    return {
      status: true,
      pagination: {
        offset: pagination.offset,
        limit: pagination.limit,
        total,
        returned: users.length
      },
      response: users
    }

  }


  @ApiOperation(
    {
      summary: 'Get individual user',
      description: 'Get details of specific user via userId'
    }
  )
  @Get(':id')
  async show(
    @Req() req,
    @Param('id', ParseIntPipe) userId: number
  ) {

    const { accountId } = req.user;

    const user = await this.databaseService.FindOne(USER_COL, { userId, accountId }, { projection: { password: 0, __v: 0 } });

    if (!user) {
      throw new HttpException(
        `No data found`,
        HttpStatus.NOT_FOUND
      );
    }

    return {
      sttatus: true,
      response: user
    }


  }


  @ApiOperation(
    {
      summary: 'Update user',
      description: 'Logged in user can update self details'
    }
  )
  @Put()
  async update(
    @Req() req,
    @Body(new CustomValidationPipe(JoiValidationSchema.updateUserchema)) payload: any
  ) {

    const { accountId, userId } = req.user;

    const user = await this.databaseService.FindOne(USER_COL, { userId });

    if (!user) {
      throw new HttpException(
        `No data exist`,
        HttpStatus.NOT_FOUND
      );
    }

    const response = await this.databaseService.UpdateOne(USER_COL, payload, { userId, accountId }, { projection: { password: 0, __v: 0 } });

    if (!response) {
      throw new HttpException(
        `Unable to udpate, please try again later`,
        HttpStatus.NOT_IMPLEMENTED
      );
    }

    return {
      status: true,
      response
    }

  }


  @ApiOperation(
    {
      summary: 'Remove user',
      description: 'Delete user from account'
    }
  )
  @Delete(':id')
  async delete(
    @Req() req,
    @Param('id', ParseIntPipe) userId: number
  ) {

    const { accountId, role } = req.user;

    // modify this logic as per your usecase
    if (role !== ROLES.ADMIN) {
      throw new HttpException(
        `Only ${ROLES.ADMIN} can remove user`,
        HttpStatus.BAD_REQUEST
      );
    }

    const user = await this.databaseService.FindOne(USER_COL, { userId, accountId });

    if (!user) {
      throw new HttpException(
        `No data exist`,
        HttpStatus.NOT_FOUND
      );
    }

    const response = await this.databaseService.DeleteOne(USER_COL, { accountId, userId });

    if (!response) {
      throw new HttpException(
        `Unable to delete, please try again`,
        HttpStatus.NOT_IMPLEMENTED
      );
    }

    return {
      status: true,
      response: `User Deleted!`
    }

  }


}
