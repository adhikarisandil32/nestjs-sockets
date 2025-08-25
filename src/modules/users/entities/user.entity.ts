import { UserBaseEntity } from 'src/common/database/entities/user.base.entity';
import { Column, Entity } from 'typeorm';
import { USER_ROLE } from '../constants/user.constant';
import { TableNames } from 'src/common/database/constants/common.constant';

@Entity({ name: TableNames.UsersTable })
export class UserEntity extends UserBaseEntity {
  @Column({
    name: 'role',
    type: 'enum',
    enum: USER_ROLE,
    default: USER_ROLE.USER,
    nullable: false,
  })
  role: USER_ROLE;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;
}
