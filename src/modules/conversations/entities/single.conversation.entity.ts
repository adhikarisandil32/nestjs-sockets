import { DBBaseEntity } from 'src/common/database/entities/base.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TableNames } from 'src/common/database/constants/common.constant';
import { BaseConversationEntity } from './base.conversation.entity';

@Entity({ name: TableNames.SingleConversationsTable })
export class SingleConversationEntity extends BaseConversationEntity {
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;
}
