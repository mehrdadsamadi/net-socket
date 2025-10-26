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
  namespace: 'group',
})
export class GroupGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('list')
  getList(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('group list', data);

    client.emit('list', [
      { name: 'group1' },
      { name: 'group2' },
      { name: 'group3' },
    ]);
  }
}
