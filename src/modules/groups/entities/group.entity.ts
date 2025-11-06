import { TableNames } from 'src/common/database/constants/common.constant';
import { DBBaseEntity } from 'src/common/database/entities/base.entity';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { UserGroupEntity } from 'src/modules/users-groups/entities/users-groups.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: TableNames.GroupsTable })
export class GroupEntity extends DBBaseEntity {
  @Column({ name: 'name', default: 'my group' })
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'group_admin' })
  groupAdmin: UserEntity;

  @OneToMany(() => UserGroupEntity, (userGroup) => userGroup.group, {
    nullable: false,
  })
  members: UserGroupEntity[];

  profileImage?: FileEntity;
}
