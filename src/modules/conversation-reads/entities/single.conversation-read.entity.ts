import { TableNames } from 'src/common/database/constants/common.constant';
import { DBBaseEntity } from 'src/common/database/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: TableNames.SingleConversationReadsTable })
export class SingleConversationReads extends DBBaseEntity {
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @Column({ name: 'sender_id' })
  senderId: number;

  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @Column({ name: 'receiver_id' })
  receiverId: number;

  // @ManyToOne(
  //   () => SingleConversationEntity,
  //   (conversation) => conversation.id,
  //   { nullable: false },
  // )
  // @JoinColumn({ name: 'last_read_conversation_id' })
  @Column({ name: 'last_read_conversation_id' })
  lastReadConvoId: number;
}
