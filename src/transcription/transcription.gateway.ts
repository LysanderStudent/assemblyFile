import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as fs from 'fs';
import axios from 'axios';
import { AssemblyAI } from 'assemblyai';

@WebSocketGateway(3010, { namespace: 'transcription', cors: { origin: '*' } }) // * http://localhost:3010/transcription
export class TranscriptionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('videoData')
  async handleVideo(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log(`Received video data from client: ${client.id}`);
    
    fs.writeFile('video.wav', data, (err) => {
      if (err) {
        console.error('Error al guardar el archivo de video:', err);
      } else {
        console.log('Archivo de video guardado exitosamente');
      }
    });

    // const clientAssembly = new AssemblyAI({
    //   apiKey: 'f07b771a2bad42d386e0755e6b6be933',
    // });

    // try {
    //   const transcript = await clientAssembly.transcripts.transcribe({
    //     audio: data,
    //     language_code: 'es'
    //   })
    //   console.log({ transcript });
    //   console.log(transcript.text)

    // } catch (error) {
    //   console.log(error);
    // }

  }

  handleConnection(client: Socket) {
    console.log('Client connected: ' + client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ' + client.id);
  }
}
