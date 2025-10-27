import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: any) {
    console.log('Socket Initialized');
  }

  handleConnection(client: Socket, ...args): any {
    const { sockets } = this.server.sockets;
    console.log('Client Connected', client.id);
    console.log('online users', sockets.size);
  }

  handleDisconnect(client: Socket): any {
    const { sockets } = this.server.sockets;
    console.log('Client Disconnected', client.id);
    console.log('online users', sockets.size);
  }

  @SubscribeMessage('ping')
  pingHandler(client: Socket, payload: any) {
    console.log('client id', client.id);
    console.log('ping received', payload);

    client.emit('pong', { message: 'Hello from server' });
  }
}
