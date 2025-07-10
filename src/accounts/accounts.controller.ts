import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Req, UseGuards } from '@nestjs/common';
import { ACCOUNT_COL, USER_COL } from '../constants/collections.constants';
import { DatabaseService } from '../db/db.service';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ROLES } from '../enums/roles.enum';

@ApiTags('Accounts Controller')
@ApiBearerAuth()
@UseGuards(JWTAuthGuard)
@Controller('accounts')
export class AccountsController {

  constructor(
    private readonly databaseService: DatabaseService
  ) { }

  @ApiOperation(
    {
      summary: 'Get account detail',
      description: 'Get all the details of your account'
    }
  )
  @Get()
  async show(
    @Req() req,
  ) {

    const { accountId } = req.user;

    const account = await this.databaseService.FindOne(ACCOUNT_COL, { accountId });

    if (!account) {
      throw new HttpException(
        `Unable to fetch account data`,
        HttpStatus.NOT_FOUND
      )
    }

    const users = await this.databaseService.FindMany(USER_COL, { accountId }, { projection: { password: 0, __v: 0 } });

    if (!users) {
      throw new HttpException(
        `Unable to fetch account's user(s) data`,
        HttpStatus.NOT_FOUND
      )
    }

    return {
      status: true,
      response: {
        account,
        userCount: users.length,
        users
      }
    }

  }


  @ApiOperation(
    {
      summary: 'Update account details',
      description: 'Update your account details'
    }
  )
  @Patch()
  async update(
    @Req() req,
    @Body() payload: any,
  ) {

    const { accountId } = req.user;

    const response = await this.databaseService.UpdateOne(ACCOUNT_COL, payload, { accountId });

    if (!response) {
      throw new HttpException(
        `Unable to update, please try again`,
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
      summary: 'Delete account',
      description: 'Delete account & associated user(s)'
    }
  )
  @Delete()
  async delete(
    @Req() req,
  ) {

    const { accountId, role } = req.user;

    if (role !== ROLES.ADMIN) {
      throw new HttpException(
        `only ${ROLES.ADMIN} can delete account`,
        HttpStatus.BAD_REQUEST
      );
    }

    const response = await this.databaseService.DeleteOne(ACCOUNT_COL, { accountId });

    if (!response) {
      throw new HttpException(
        `Unable to delete, please try again`,
        HttpStatus.NOT_IMPLEMENTED
      );
    }

    // delete all associated users with account
    await this.databaseService.DeleteMany(USER_COL, { accountId });

    return {
      status: true,
      response: `Account deleted!`
    }

  }


}
