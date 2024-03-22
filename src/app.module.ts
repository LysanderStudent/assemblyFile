import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranscriptionModule } from './transcription/transcription.module';
import { MyaudioModule } from './myaudio/myaudio.module';

@Module({
  imports: [TranscriptionModule, MyaudioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
