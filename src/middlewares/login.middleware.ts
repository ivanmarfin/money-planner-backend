import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { JWTHelper } from '../helpers/JWTHelper';
import { endWithStatus } from '../helpers/ResponseHelper';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): any {
    const { access_token } = req.cookies;
    if (!JWTHelper.isTokenValid(access_token)) {
      return endWithStatus(res, HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
