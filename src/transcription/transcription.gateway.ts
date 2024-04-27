import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as fs from 'fs';
import axios from 'axios';
import { AssemblyAI } from 'assemblyai';

@WebSocketGateway(3010, {
  namespace: 'transcription',
  cors: { origin: '*' },
  maxHttpBufferSize: 200 * 1024 * 1024
}) // * http://localhost:3010/transcription
export class TranscriptionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('recorderData')
  async handleAudio(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const fileName = 'recorder.wav';

    try {
      fs.writeFileSync(fileName, data)
      console.log('Archivo de grabacion guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el archivo de grabacion:', error);
    }

    const clientAssembly = new AssemblyAI({
      apiKey: 'f07b771a2bad42d386e0755e6b6be933',
    });

    try {
      const transcript = await clientAssembly.transcripts.create({
        audio_url: fileName,
        speaker_labels: true,
        language_code: 'es'
      })

      let text = '';

      for (let utterance of transcript.utterances) {
        const line = `Speaker ${utterance.speaker}: ${utterance.text}\n`;
        text += line;
      }
      
      console.log(text);
      fs.writeFileSync('text-speakers.txt', text);
      console.log('Archivo de texto guardado exitosamente');
      client.emit(text);

    } catch (error) {
      console.log(error);
    }

  }

  handleConnection(client: Socket) {
    console.log('Client connected: ' + client.id);

    client.on('disconnect', (reason) => {
      console.log('Client reason:', reason);
    });

    client.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ' + client.id);
  }
}
