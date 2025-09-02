import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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
import { USER_ROLE } from 'src/modules/users/constants/user.constant';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import {
  SocketEvents,
  SocketNamespaces,
} from 'src/socket/constants/socket.constants';
// import { WsJwtAuthGuard } from 'src/modules/auth/guards/ws-auth.guard';

interface AuthenticatedSocket extends Socket {
  handshake: Socket['handshake'] & { __user: UserEntity };
}

@WebSocketGateway({ cors: true, namespace: SocketNamespaces.Chat })
// @UseGuards(WsJwtAuthGuard)
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private jwtSecret: string;
  private connectedUsers: Set<string>;
  private connectedUsersCount: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly _usersService: UsersService,
  ) {
    this.connectedUsers = new Set();
    this.connectedUsersCount = 0;
    this.jwtSecret = configService.get<string>('jwt.secretKey')!;
  }

  afterInit(server: Server) {
    server.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
          throw new WsException('no authorization token');
        }

        const decodedToken = this.jwtService.verify<{
          id: number;
          role: USER_ROLE;
        }>(token, {
          secret: this.jwtSecret,
        });

        const associatedUser = await this._usersService.findOneById(
          decodedToken.id,
        );

        if (!associatedUser) {
          throw new WsException('user not available');
        }

        socket.handshake.__user = associatedUser;

        next();
      } catch (error) {
        socket.disconnect();
        next(error);
      }
    });
  }

  handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
    const socketUser: UserEntity = client.handshake.__user;

    this.connectedUsers.add(socketUser.email);
    this.connectedUsersCount++;
    this.showConnectedClients();
  }

  handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    client.disconnect();

    const socketUser: UserEntity = client.handshake.__user;

    this.connectedUsers.delete(socketUser.email);
    this.connectedUsersCount--;
    this.showConnectedClients();
  }

  showConnectedClients() {
    this.server.emit(SocketEvents.Connections, {
      users: Array.from(this.connectedUsers),
      count: this.connectedUsersCount,
    });
  }

  @SubscribeMessage('message')
  async handleMessageEvent(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() message: string,
  ) {
    const trimmedMessage = message?.trim();

    if (!trimmedMessage) return;

    const socketUser: UserEntity = socket.handshake.__user;

    return this.server.emit(SocketEvents.Message, {
      senderName: socketUser.name,
      message: trimmedMessage,
    });
  }

  createRoom(socket: AuthenticatedSocket, data: string) {
    socket.join('aRoom');
    socket.to('aRoom').emit('roomCreated', { room: 'aRoom' });
    return { event: 'roomCreated', room: 'aRoom' };
  }
}
