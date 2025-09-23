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
import { WsErrorService } from 'src/common/error/error.service';
import { IJwtUser } from 'src/modules/auth/interfaces/jwt.interface';
import { ConversationService } from 'src/modules/conversations/services/conversation.service';
import { UsersGroupsService } from 'src/modules/users-groups/services/users-groups.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import {
  SocketEvents,
  SocketNamespaces,
} from 'src/socket/constants/socket.constants';
import { IMessage } from '../interfaces/chat.interface';
import { ChatRoomDto } from '../dtos/chat-room.dto';
// import { WsJwtAuthGuard } from 'src/modules/auth/guards/ws-auth.guard';

interface AuthenticatedSocket extends Socket {
  handshake: Socket['handshake'] & { __user: UserEntity };
}

@UseFilters(new WsErrorService())
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
    private readonly usersService: UsersService,
    private readonly conversationService: ConversationService,
    private readonly userGroupService: UsersGroupsService,
  ) {
    this.connectedUsers = new Set();
    this.connectedUsersCount = 0;
    this.jwtSecret = this.configService.get<string>('jwt.secretKey')!;
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

        const associatedUser = await this.usersService.findOneById(
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
    message: IMessage,
  ) {
    const trimmedMessage = message.text?.trim();

    if (!trimmedMessage) {
      throw new WsException('invalid message format');
    }

    if (
      (!message.groupId && !message.receiverUserId) ||
      (message.groupId && message.receiverUserId)
    ) {
      throw new WsException('invalid message format');
    }

    const socketUser: UserEntity = socket.handshake.__user;

    // for group conversation
    if (message.groupId) {
      const userInGroup = await this.userGroupService.checkUserInGroup({
        groupId: message.groupId,
        memberId: socketUser.id,
      });

      if (!userInGroup) {
        const errorMessage = "user doesn't belong to group";
        throw new WsException(errorMessage);
      }

      await this.conversationService.createGroupConvo({
        message: trimmedMessage,
        senderId: socketUser.id,
        groupId: message.groupId,
      });

      this.server.emit(SocketEvents.Message, {
        senderName: socketUser.name,
        message: trimmedMessage,
      });
    }

    // for single conversation
    if (message.receiverUserId) {
      await this.conversationService.createSingleConvo({
        message: trimmedMessage,
        senderId: socketUser.id,
        receiverId: message.receiverUserId,
      });

      this.server.emit(SocketEvents.Message, {
        senderName: socketUser.name,
        message: trimmedMessage,
      });
    }

    console.log({ socketRooms: Array.from(socket.rooms) });

    return;
  }

  @SubscribeMessage(SocketEvents.CreateRoom)
  async createRoom(socket: AuthenticatedSocket, chatRoomDto: ChatRoomDto) {
    // console.log(chatRoomDto);
    // console.log(socket.rooms, socket.id);
    // console.log(this.server.adapter?.['rooms']);

    const socketUser = socket.handshake.__user;

    const members = await this.usersService.getUsersByIds(chatRoomDto.userIds);

    const memberSocketsInfo = Array.from(this.connectedUsers)
      .filter((user) => members.filter((member) => member.email === user.email))
      .map((user) => user.socketInfo);

    const createdGroup = await this.groupService.create(socketUser, {
      name: chatRoomDto.name,
      memberIds: members.map((member) => member.id),
    });

    const roomName = `room_${createdGroup.name}_${createdGroup.id}`;

    memberSocketsInfo.forEach((memberSocket) => memberSocket.join(roomName));

    this.server
      .to(roomName)
      .emit(
        SocketEvents.Message,
        `You have been added to the group '${createdGroup.name}'`,
      );

    return;
  }
}
