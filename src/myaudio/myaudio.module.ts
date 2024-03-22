import { Module } from '@nestjs/common';
import { MyaudioController } from './myaudio.controller';
import { MyaudioService } from './myaudio.service';

@Module({
  controllers: [MyaudioController],
  providers: [MyaudioService]
})
export class MyaudioModule {}
