import { TableNames } from 'src/common/database/constants/common.constant';
import { DBBaseEntity } from 'src/common/database/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: TableNames.GroupConversationReadsTable })
export class ReadGroupConversationEntity extends DBBaseEntity {
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @Column({ name: 'sender_id' })
  senderId: number;

  // @ManyToOne(() => GroupEntity, (group) => group.id, { nullable: false })
  @Column({ name: 'group_id' })
  groupId: number;

  @Column({ name: 'last_read_conversation_id' })
  lastReadConvoId: number;
}
