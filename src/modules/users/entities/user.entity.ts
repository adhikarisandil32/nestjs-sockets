import { UserBaseEntity } from 'src/common/database/entities/user.base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends UserBaseEntity {
  @Column({ name: 'role', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;
}
