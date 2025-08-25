import { DBBaseEntity } from 'src/common/database/entities/base.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'groups' })
export class GroupEntity extends DBBaseEntity {
  @Column({ name: 'name', default: 'my group' })
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'group_admin' })
  groupAdmin: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinTable({
    name: 'groups_users',
    joinColumn: {
      name: 'group_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[];
}
