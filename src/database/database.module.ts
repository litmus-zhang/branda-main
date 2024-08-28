import { Module, Global } from '@nestjs/common';
import { providers } from './database.provider';

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}
