import {
  AfterQueryEvent,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  LoadEvent,
  RemoveEvent,
} from 'typeorm';
import { GroupEntity } from '../entities/group.entity';
import { Injectable } from '@nestjs/common';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { Folder } from 'src/modules/files/constants/folders.file-upload';

@Injectable()
@EventSubscriber()
export class GroupEntitySubscriber
  implements EntitySubscriberInterface<GroupEntity>
{
  listenTo(): Function | string {
    return GroupEntity;
  }

  async afterLoad(
    entity: GroupEntity,
    event?: LoadEvent<GroupEntity> | undefined,
  ): Promise<any | void> {
    // console.log(entity.id);
    // and below is the sql query that has been run by the function below it
    /**
query: SELECT "FileEntity"."id" AS "FileEntity_id", "FileEntity"."created_at" AS "FileEntity_created_at", "FileEntity"."updated_at" AS "FileEntity_updated_at", "FileEntity"."deleted_at" AS "FileEntity_deleted_at", "FileEntity"."path" AS "FileEntity_path", "FileEntity"."filename" AS "FileEntity_filename", "FileEntity"."association_id" AS "FileEntity_association_id", "FileEntity"."association_type" AS "FileEntity_association_type" FROM "files" "FileEntity" WHERE ( (("FileEntity"."association_id" = $1) AND ("FileEntity"."association_type" = $2)) ) AND ( "FileEntity"."deleted_at" IS NULL ) LIMIT 1 -- PARAMETERS: [12,"group"]
query: SELECT "FileEntity"."id" AS "FileEntity_id", "FileEntity"."created_at" AS "FileEntity_created_at", "FileEntity"."updated_at" AS "FileEntity_updated_at", "FileEntity"."deleted_at" AS "FileEntity_deleted_at", "FileEntity"."path" AS "FileEntity_path", "FileEntity"."filename" AS "FileEntity_filename", "FileEntity"."association_id" AS "FileEntity_association_id", "FileEntity"."association_type" AS "FileEntity_association_type" FROM "files" "FileEntity" WHERE ( (("FileEntity"."association_id" = $1) AND ("FileEntity"."association_type" = $2)) ) AND ( "FileEntity"."deleted_at" IS NULL ) LIMIT 1 -- PARAMETERS: [13,"group"]
query: SELECT "FileEntity"."id" AS "FileEntity_id", "FileEntity"."created_at" AS "FileEntity_created_at", "FileEntity"."updated_at" AS "FileEntity_updated_at", "FileEntity"."deleted_at" AS "FileEntity_deleted_at", "FileEntity"."path" AS "FileEntity_path", "FileEntity"."filename" AS "FileEntity_filename", "FileEntity"."association_id" AS "FileEntity_association_id", "FileEntity"."association_type" AS "FileEntity_association_type" FROM "files" "FileEntity" WHERE ( (("FileEntity"."association_id" = $1) AND ("FileEntity"."association_type" = $2)) ) AND ( "FileEntity"."deleted_at" IS NULL ) LIMIT 1 -- PARAMETERS: [16,"group"]
query: SELECT "FileEntity"."id" AS "FileEntity_id", "FileEntity"."created_at" AS "FileEntity_created_at", "FileEntity"."updated_at" AS "FileEntity_updated_at", "FileEntity"."deleted_at" AS "FileEntity_deleted_at", "FileEntity"."path" AS "FileEntity_path", "FileEntity"."filename" AS "FileEntity_filename", "FileEntity"."association_id" AS "FileEntity_association_id", "FileEntity"."association_type" AS "FileEntity_association_type" FROM "files" "FileEntity" WHERE ( (("FileEntity"."association_id" = $1) AND ("FileEntity"."association_type" = $2)) ) AND ( "FileEntity"."deleted_at" IS NULL ) LIMIT 1 -- PARAMETERS: [19,"group"]
query: SELECT "FileEntity"."id" AS "FileEntity_id", "FileEntity"."created_at" AS "FileEntity_created_at", "FileEntity"."updated_at" AS "FileEntity_updated_at", "FileEntity"."deleted_at" AS "FileEntity_deleted_at", "FileEntity"."path" AS "FileEntity_path", "FileEntity"."filename" AS "FileEntity_filename", "FileEntity"."association_id" AS "FileEntity_association_id", "FileEntity"."association_type" AS "FileEntity_association_type" FROM "files" "FileEntity" WHERE ( (("FileEntity"."association_id" = $1) AND ("FileEntity"."association_type" = $2)) ) AND ( "FileEntity"."deleted_at" IS NULL ) LIMIT 1 -- PARAMETERS: [20,"group"]
*/
    if (entity) {
      const profileImage = await event?.manager
        .getRepository(FileEntity)
        .findOne({
          where: {
            associationId: entity.id,
            associationType: Folder.Group,
          },
        });

      entity.profileImage = profileImage!;
    }
  }
}
