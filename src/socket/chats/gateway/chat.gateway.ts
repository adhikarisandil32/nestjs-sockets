import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Set<string> = new Set();
  private connectedUsersCount: number = 0;

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`client ${client.id} connected`);
    this.connectedUsers.add(client.id);
    this.connectedUsersCount++;
    this.server.emit('connections', {
      users: Array.from(this.connectedUsers),
      count: this.connectedUsersCount,
    });
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`client ${client.id} disconnected`);
    client.disconnect();
    this.connectedUsers.delete(client.id);
    this.connectedUsersCount--;
    this.server.emit('connections', {
      users: Array.from(this.connectedUsers),
      count: this.connectedUsersCount,
    });
  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.server.emit('message', { client: client.id, message: data });
  }
}
