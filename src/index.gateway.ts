import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User {
  id: number;
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

  @SubscribeMessage('join-room')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomPayload,
  ) {
    if (client.id && data.roomName) {
      if (client.rooms.has(data.roomName)) {
        console.log('already joined in : ', data.roomName);
      } else {
        client.join(data.roomName);
      }
    } else {
      client.emit('exception', 'you are not connected');
    }
  }

  @SubscribeMessage('server-chat')
  async serverChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Message,
  ) {
    if (data.roomName) {
      return this.server.to(data.roomName).emit('client-chat', data);
    }

    return client.emit('exception', 'room not found');
  }
}
