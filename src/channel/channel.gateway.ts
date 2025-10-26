import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'channel',
})
export class ChannelGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('list')
  getList(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('channel list', data);

    client.emit('list', [
      { name: 'channel1' },
      { name: 'channel2' },
      { name: 'channel3' },
    ]);
  }
}
