import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranscriptionModule } from './transcription/transcription.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TranscriptionModule,
    ConfigModule.forRoot({
      envFilePath: '.env'
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
