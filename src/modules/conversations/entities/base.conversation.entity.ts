import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { MESSAGE_STATUS } from '../constants/conversation.constant';
import { DBBaseEntity } from 'src/common/database/entities/base.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class BaseConversationEntity extends DBBaseEntity {
  @Column({ name: 'message', nullable: false })
  message: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: MESSAGE_STATUS,
    nullable: false,
  })
  status: MESSAGE_STATUS;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;
}
