import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export function endWithStatus(response: Response, status: HttpStatus): void {
  response.status(status);
  response.end();
}
