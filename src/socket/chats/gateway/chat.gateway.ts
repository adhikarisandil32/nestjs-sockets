import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtAuthGuard } from 'src/modules/auth/guards/ws-auth.guard';

@WebSocketGateway({ cors: true, namespace: 'socket/chat' })
@UseGuards(WsJwtAuthGuard)
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private connectedUsers: Set<string> = new Set();
  private connectedUsersCount: number = 0;

  afterInit(server: Server) {
    server.use(async (socket, next) => {
      try {
        const token = socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
          throw new WsException('no authorization token');
        }

        next();
      } catch (error) {
        socket.disconnect();
        next(error);
      }
    });
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.connectedUsers.add(client.id);
    this.connectedUsersCount++;
    this.showConnectedClients();
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    client.disconnect();
    this.connectedUsers.delete(client.id);
    this.connectedUsersCount--;
    this.showConnectedClients();
  }

  showConnectedClients() {
    this.server.emit('connections', {
      users: Array.from(this.connectedUsers),
      count: this.connectedUsersCount,
    });
  }

  @SubscribeMessage('message')
  handleMessageEvent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    console.log(socket.handshake['user']);

    return this.server.emit('message', {
      clientId: socket.id,
      message,
    });
  }

  createRoom(socket: Socket, data: string) {
    socket.join('aRoom');
    socket.to('aRoom').emit('roomCreated', { room: 'aRoom' });
    return { event: 'roomCreated', room: 'aRoom' };
  }
}
