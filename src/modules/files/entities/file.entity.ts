import { TableNames } from 'src/common/database/constants/common.constant';
import { DBBaseEntity } from 'src/common/database/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { Folder } from '../constants/folders.file-upload';

@Entity({ name: TableNames.FilesTable })
export class FileEntity extends DBBaseEntity {
  @Column({ name: 'path', nullable: true })
  path: string;

  @Column({ name: 'filename', nullable: false })
  fileName: string;

  @Column({ name: 'association_id', nullable: true })
  associationId: number;

  @Column({
    name: 'association_type',
    nullable: true,
    enum: Folder,
    type: 'enum',
  })
  associationType: Folder;
}
