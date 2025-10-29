export enum SocketEvents {
  Connections = 'connections',
  Message = 'message',
  Error = 'socket-error',

  // using 'error' like below automatically caused the receiver client to disconnect. may be 'error' is some sort of nestjs way of handling error so we send different event 'socket-error'
  // Error = 'error',

  CreateRoom = 'create-room',
  LastReadUpdates = 'last-read-updates',
  ExistingRooms = 'existing-rooms',
}

export enum SocketNamespaces {
  Chat = 'socket/chat',
}
