import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User {
  username: string;
  socketId: string;
}

interface JoinRoomPayload {
  roomName: string;
  user: User;
}

interface Message {
  message: string;
  user: User;
  time: string;
  roomName: string;
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class IndexGateway {
  @WebSocketServer() server: Server;

  checkAuth(client: Socket) {
    console.log('client hand', client?.handshake?.auth);
    console.log('client que', client?.handshake?.query);
  }

  @SubscribeMessage('join-room')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomPayload,
  ) {
    this.checkAuth(client);

    if (client.id && data.roomName) {
      if (client.rooms.has(data.roomName)) {
        console.log('already joined in : ', data.roomName);
      } else {
        await client.join(data.roomName);
      }
    } else {
      client.emit('exception', 'you are not connected');
    }
  }

  @SubscribeMessage('server-chat')
  serverChat(@ConnectedSocket() client: Socket, @MessageBody() data: Message) {
    this.checkAuth(client);

    if (data.roomName) {
      return this.server.to(data.roomName).emit('client-chat', data);
    }

    return client.emit('exception', 'room not found');
  }
}
