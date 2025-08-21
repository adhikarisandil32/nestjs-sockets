import { DBBaseEntity } from 'src/common/database/entities/base.entity';
import { GroupEntity } from 'src/modules/groups/entities/group.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'messages' })
export class MessageEntity extends DBBaseEntity {
  @Column({ name: 'message', nullable: false })
  message: string;

  @ManyToOne(() => GroupEntity, (group) => group.id, { nullable: false })
  @JoinColumn({ name: 'group_id' })
  groupId: GroupEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;
}
