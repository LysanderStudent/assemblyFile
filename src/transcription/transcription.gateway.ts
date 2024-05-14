import * as fs from 'fs';
import { Server, Socket } from 'socket.io';
import { AssemblyAI } from 'assemblyai';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';

const MB = 200;

@WebSocketGateway(3010, {
  cors: { origin: '*' },
  maxHttpBufferSize: MB * 1024 * 1024
}) // * http://[::1]:3010
export class TranscriptionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private fileName = 'recorder.wav';

  @WebSocketServer()
  server: Server;

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

  @SubscribeMessage('transcript')
  async transcript(@ConnectedSocket() client: Socket) {
    const clientAssembly = new AssemblyAI({
      apiKey: process.env.ASSEMBLY_KEY,
    });

    try {
      console.log('Transcripting...');
      const transcript = await clientAssembly.transcripts.transcribe({
        audio: this.fileName,
        speaker_labels: true,
        language_code: 'es'
      })

      let text = '';
      let speakersCount = 0;
      const letterSpeaker: string[] = [];

      for (let utterance of transcript.utterances) {
        if (!letterSpeaker.includes(utterance.speaker)) {
          speakersCount++;
          letterSpeaker.push(utterance.speaker);
        }
      }

      for (let utterance of transcript.utterances) {
        const line = `Speaker ${utterance.speaker}: ${utterance.text} \n`;
        text += line;
      }

      fs.writeFileSync('text-speakers.txt', text);
      console.log('Archivo de texto guardado exitosamente');
      client.emit('audioTranscripted', { text });

    } catch (error) {
      console.error(error);
      client.emit('transcriptError', { message: 'Error al guardar el archivo.', error: error.message });
    }
  }


  @SubscribeMessage('uploadFileToServer')
  async uploadFileToServer(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    try {
      fs.writeFileSync(this.fileName, data);
      client.emit('fileUploaded', { message: 'Archivo guardado exitosamente. Iniciando transcripción...' });
    } catch (error) {
      console.error(error);
      client.emit('uploadFileError', { message: 'Error al guardar el archivo.', error: error.message });
    }
  }
}
