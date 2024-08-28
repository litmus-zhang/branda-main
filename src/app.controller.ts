import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  check() {
    // return this.health.check([
    //   () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    // ]);
    return {
      status: 'OK',
      message: 'All systems are operational',
    };
  }
}
