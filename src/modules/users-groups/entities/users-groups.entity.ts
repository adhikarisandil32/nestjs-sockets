import { TableNames } from 'src/common/database/constants/common.constant';
import { DBBaseEntity } from 'src/common/database/entities/base.entity';
import { GroupEntity } from 'src/modules/groups/entities/group.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { UserGroupJoinStatus } from '../constants/user-group.constant';

@Entity({ name: TableNames.UsersGroupsLinkerTable })
@Unique(['member', 'group'])
export class UserGroupEntity extends DBBaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'member_id' })
  member: UserEntity;

  @ManyToOne(() => GroupEntity, (group) => group.id, { nullable: false })
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;

  @Column({
    name: 'join_status',
    type: 'enum',
    enum: UserGroupJoinStatus,
    nullable: false,
  })
  joinStatus: UserGroupJoinStatus;
}
