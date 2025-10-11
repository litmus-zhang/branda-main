import { Module, Global } from '@nestjs/common';
import { providers } from './database.provider';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [DatabaseService, ...providers],
  exports: [...providers],
})
export class DatabaseModule {}
