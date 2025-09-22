import { GroupEntity } from 'src/modules/groups/entities/group.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TableNames } from 'src/common/database/constants/common.constant';
import { BaseConversationEntity } from './base.conversation.entity';

@Entity({ name: TableNames.GroupConversationsTable })
export class GroupConversationEntity extends BaseConversationEntity {
  @ManyToOne(() => GroupEntity, (group) => group.id, { nullable: false })
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}
