import { Controller, Get } from '@nestjs/common';
import { MyaudioService } from './myaudio.service';

@Controller('myaudio')
export class MyaudioController {
    constructor(private readonly myaudioService: MyaudioService) {}

    @Get()
    sendFile() {
        return this.myaudioService.sendFile();
    }
}
