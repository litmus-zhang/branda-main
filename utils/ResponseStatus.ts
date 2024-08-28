import { HttpStatus } from '@nestjs/common';

export interface ResponseStatus {
  status?: HttpStatus;
  message: string;
  error?: string;
  data?: any;
}
