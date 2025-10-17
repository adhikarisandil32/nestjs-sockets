export interface IMessage {
  text: string;
  groupId: number | undefined;
  receiverUserId: number | undefined;
}

export interface ILastReadUpdate {
  requestedUserId: number;
  groupId: number;
  lastReadConversationId: number;
}
