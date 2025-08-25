import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'api/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Set<string> = new Set();
  private connectedUsersCount: number = 0;

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`client ${client.id} connected`);
    this.connectedUsers.add(client.id);
    this.connectedUsersCount++;
    this.showConnectedClients();
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`client ${client.id} disconnected`);
    client.disconnect();
    this.connectedUsers.delete(client.id);
    this.connectedUsersCount--;
    this.showConnectedClients();
  }

  showConnectedClients() {
    // this.server.emit('connections', {
    //   users: Array.from(this.connectedUsers),
    //   count: this.connectedUsersCount,
    // });
  }

  createRoom(socket: Socket, data: string) {
    socket.join('aRoom');
    socket.to('aRoom').emit('roomCreated', { room: 'aRoom' });
    return { event: 'roomCreated', room: 'aRoom' };
  }
}
