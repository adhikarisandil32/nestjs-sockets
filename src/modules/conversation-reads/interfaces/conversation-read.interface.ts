export interface SingleConversationReadInterface {
  requestingUserId: number;
  requestedUserId: number;
  lastReadConvoId: number;
}

export interface GroupConversationReadInterface {
  senderId: number;
  groupId: number;
  lastReadConvoId: number;
}
