import { Injectable } from '@nestjs/common';
import { AssemblyAI } from 'assemblyai';

@Injectable()
export class MyaudioService {
    async sendFile() {
        const client = new AssemblyAI({
            apiKey: 'f07b771a2bad42d386e0755e6b6be933',
        });
        const audioUrl = 'alberto.webm';

        const params = {
            audio: audioUrl,
            language_code: 'es'
        }

        try {
            const transcript = await client.transcripts.transcribe(params)
            console.log(transcript.text)

            return {
                ok: true,
                code: 200,
                data: transcript
            }
        } catch (error) {
            console.log(error);
        }
    }
}
