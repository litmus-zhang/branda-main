import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BrandModule } from './brand/brand.module';
import { TerminusModule } from '@nestjs/terminus';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    BrandModule,
    TerminusModule,
    LlmModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
