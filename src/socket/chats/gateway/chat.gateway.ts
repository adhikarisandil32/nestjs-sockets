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
import { ILastReadUpdate, IMessage } from '../interfaces/chat.interface';
import { ChatRoomDto } from '../dtos/chat-room.dto';
import { GroupsService } from 'src/modules/groups/services/group.service';
import { LastReadConversationService } from 'src/modules/conversation-reads/services/conversation-read.service';
// import { WsJwtAuthGuard } from 'src/modules/auth/guards/ws-auth.guard';

interface AuthenticatedSocket extends Socket {
  handshake: Socket['handshake'] & { __user: UserEntity };
}

interface IConnectedUser {
  email: string;
  socketInfo: Socket;
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
  private connectedUsers: Set<IConnectedUser>;
  private connectedUsersCount: number;
  // private rooms: Map<string, Set<string>>;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly conversationService: ConversationService,
    private readonly userGroupService: UsersGroupsService,
    private readonly groupService: GroupsService,
    private readonly lastReadConversationService: LastReadConversationService,
  ) {
    this.connectedUsers = new Set();
    // this.rooms = new Map();
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

  async handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
    const socketUser: UserEntity = client.handshake.__user;

    this.connectedUsers.add({ email: socketUser.email, socketInfo: client });
    this.connectedUsersCount++;
    this.showConnectedClients();

    // const groups = await this.dataSource.getRepository(UserGroupEntity).find({
    //   where: {
    //     member: {
    //       id: socketUser.id,
    //     },
    //   },
    // });

    // console.log(groups);

    const groups = await this.usersService.findGroups(socketUser.id);

    groups.forEach((group) => {
      const roomIdentifier = `room__${group.group.id}`;
      client.join(roomIdentifier);

      // if (!this.rooms.has(roomIdentifier)) {
      //   // const memberSocketIds = this.rooms.get(roomName)!

      //   this.rooms.set(roomIdentifier, new Set(client.id));
      //   return;
      // }

      // const existingRoomMembers = this.rooms.get(roomIdentifier)!;

      // this.rooms.set(roomIdentifier, existingRoomMembers.add(client.id));
      return;
    });

    return;
  }

  handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    client.disconnect();

    const socketUser: UserEntity = client.handshake.__user;

    const disconnectedSocketInfo = Array.from(this.connectedUsers).find(
      (user) => user.email === socketUser.email,
    );

    if (disconnectedSocketInfo) {
      this.connectedUsers.delete(disconnectedSocketInfo);
      this.connectedUsersCount--;
    }

    this.showConnectedClients();

    return;
  }

  showConnectedClients() {
    this.server.emit(SocketEvents.Connections, {
      users: Array.from(this.connectedUsers).map((user) => user.email),
      count: this.connectedUsersCount,
    });
    return;
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

      const conversation = await this.conversationService.createGroupConvo({
        message: trimmedMessage,
        senderId: socketUser.id,
        groupId: message.groupId,
      });

      this.server.to(`room__${message.groupId}`).emit(SocketEvents.Message, {
        senderName: socketUser.name,
        message: trimmedMessage,
        groupId: message.groupId,
        conversationId: conversation.id,
      });
    }

    // for single conversation
    if (message.receiverUserId) {
      const receiverUserInfo = await this.usersService.findOneById(
        message.receiverUserId,
      );

      if (!receiverUserInfo) {
        const errorMessage = 'user unauthorized';
        throw new WsException(errorMessage);
      }

      const receiverUserSocketInfo = Array.from(this.connectedUsers).find(
        (user) => user.email === receiverUserInfo.email,
      );

      const conversation = await this.conversationService.createSingleConvo({
        message: trimmedMessage,
        senderId: socketUser.id,
        receiverId: message.receiverUserId,
      });

      if (!receiverUserSocketInfo) {
        const errorMessage = 'receiver not online';
        throw new WsException(errorMessage);
      }

      this.server
        .to(receiverUserSocketInfo.socketInfo.id)
        .emit(SocketEvents.Message, {
          senderName: socketUser.name,
          message: trimmedMessage,
          receiverId: message.receiverUserId,
          conversationId: conversation.id,
        });
    }

    // console.log({ socketRooms: Array.from(socket.rooms) });

    return;
  }

  // possibility of optimization instead of n^2 loop
  @SubscribeMessage(SocketEvents.CreateRoom)
  async createRoom(socket: AuthenticatedSocket, chatRoomDto: ChatRoomDto) {
    const socketUser = socket.handshake.__user;

    const members = await this.usersService.getUsersByIds(chatRoomDto.userIds);

    const memberSocketsInfo = [
      socket,
      ...Array.from(this.connectedUsers)
        .filter((user) => members.find((member) => member.email === user.email))
        .map((user) => user.socketInfo),
    ];

    const createdGroup = await this.groupService.create(socketUser, {
      name: chatRoomDto.name,
      memberIds: members.map((member) => member.id),
      ...(chatRoomDto.profileImageId
        ? { profileImageId: chatRoomDto.profileImageId }
        : {}),
    });

    const roomName = `room__${createdGroup.id}`;

    memberSocketsInfo.forEach((memberSocket) => memberSocket.join(roomName));

    this.server
      .to(roomName)
      .emit(
        SocketEvents.Message,
        `You have been added to the group '${chatRoomDto.name}'`,
      );

    // console.log(this.server.adapter?.['rooms']);

    return { roomName };
  }

  @SubscribeMessage(SocketEvents.LastReadUpdates)
  async handleLastReadConversationUpdates(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() updateLastReadData: ILastReadUpdate,
  ) {
    const socketUser = socket.handshake.__user;
    try {
      if (
        (updateLastReadData.groupId && updateLastReadData.requestedUserId) ||
        (!updateLastReadData.groupId && !updateLastReadData.requestedUserId)
      ) {
        throw new WsException('only provide either groupId or requestedUserId');
      }

      if (updateLastReadData.requestedUserId) {
        const updatedLastRead =
          await this.lastReadConversationService.updateSingleLastReadConvo({
            requestingUserId: socketUser.id,
            requestedUserId: updateLastReadData.requestedUserId,
            lastReadConversationId: updateLastReadData.lastReadConversationId,
          });

        return updatedLastRead;
      }

      if (updateLastReadData.groupId) {
        const updatedLastRead =
          await this.lastReadConversationService.updateGroupLastReadConvo({
            groupId: updateLastReadData.groupId,
            senderId: socketUser.id,
            lastReadConversationId: updateLastReadData.lastReadConversationId,
          });

        return updatedLastRead;
      }

      throw new WsException('no group or receiver id provided');
    } catch (error) {
      throw new WsException(error.message ?? 'Request Execution Failed');
    }
  }

  /**
   * MARK: Utility Methods Only
   */

  @SubscribeMessage('existing-rooms')
  async getRooms(@ConnectedSocket() socket: AuthenticatedSocket) {
    const roomsMap: Map<string, Set<string>> = this.server.adapter?.['rooms'];

    const roomsObj = Array.from(roomsMap).map(([room, sockets]) => ({
      room,
      activeSockets: Array.from(sockets),
    }));

    console.log(roomsObj);

    return;
  }

  @SubscribeMessage('list-sockets')
  async listSockets(@ConnectedSocket() socket: AuthenticatedSocket) {
    const connectedSockets = await this.server.fetchSockets();

    console.log(connectedSockets);
  }

  @SubscribeMessage('connected-socket-rooms')
  async getConnectedSocketRooms(
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const rooms = socket.rooms;

    console.log(rooms);
  }

  @SubscribeMessage('active-sockets-in-room')
  async getActiveSocketsInRoom(@ConnectedSocket() socket: AuthenticatedSocket) {
    const sockets = await this.server.in('room__1').fetchSockets();

    console.log(sockets.map((socket) => socket.handshake?.['__user']));
    // because the handshake doesn't contain the type of the __user while still has the value
  }
}
