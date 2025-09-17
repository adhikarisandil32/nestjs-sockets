import { UseFilters } from '@nestjs/common';
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
import { ErrorService } from 'src/common/error/error.service';
import { IJwtUser } from 'src/modules/auth/interfaces/jwt.interface';
import { MessageService } from 'src/modules/messages/services/message.service';
import { UsersGroupsService } from 'src/modules/users-groups/services/users-groups.service';
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

@UseFilters(new ErrorService())
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
    private readonly messageService: MessageService,
    private readonly userGroupService: UsersGroupsService,
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

        const decodedToken = this.jwtService.verify<IJwtUser>(token, {
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

  @SubscribeMessage(SocketEvents.Message)
  async handleMessageEvent(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody()
    message: {
      text: string;
      groupId: number;
    },
  ) {
    const trimmedMessage = message.text?.trim();

    if (!trimmedMessage || !message.groupId) {
      throw new WsException('invalid message format');
    }

    const socketUser: UserEntity = socket.handshake.__user;

    const userInGroup = await this.userGroupService.checkUserInGroup({
      groupId: message.groupId,
      memberId: socketUser.id,
    });

    if (!userInGroup) {
      const errorMessage = "user doesn't belong to group";
      throw new WsException(errorMessage);
    }

    await this.messageService.create({
      message: message.text,
      senderId: socketUser.id,
      groupId: message.groupId,
    });

    this.server.emit(SocketEvents.Message, {
      senderName: socketUser.name,
      message: trimmedMessage,
    });

    return;
  }

  createRoom(socket: AuthenticatedSocket, data: string) {
    socket.join('aRoom');
    socket.to('aRoom').emit('roomCreated', { room: 'aRoom' });
    return { event: 'roomCreated', room: 'aRoom' };
  }
}
