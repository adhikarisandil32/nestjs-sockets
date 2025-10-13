import { USER_ROLE } from 'src/modules/users/constants/user.constant';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { GroupEntity } from 'src/modules/groups/entities/group.entity';
import { UserGroupEntity } from 'src/modules/users-groups/entities/users-groups.entity';

/**************************
 ** This is users seeder **
 **************************/
export async function seedUsers(usersRepository: Repository<UserEntity>) {
  try {
    const existingAdmin = await usersRepository.find({
      where: {
        role: USER_ROLE.ADMIN,
        email: 'admin@gmail.com',
      },
    });

    if (existingAdmin.length < 1) {
      const admin = usersRepository.create({
        email: 'admin@gmail.com',
        password: 'Test@123',
        name: 'Admin Admin',
        role: USER_ROLE.ADMIN,
        isActive: true,
      });

      await usersRepository.save(admin);
    }

    const otherExistingUsers = await usersRepository.find({
      where: {
        role: USER_ROLE.USER,
      },
    });

    if (otherExistingUsers.length >= 10) {
      return;
    }

    const otherUsersArray = Array.from(
      { length: 10 - otherExistingUsers.length },
      () => ({
        email: faker.internet.email().toLowerCase(),
        password: 'Test@123',
        name: faker.person.fullName(),
        role: USER_ROLE.USER,
        isActive: true,
      }),
    );

    const moreUsers = [
      {
        email: 'sandil1@gmail.com',
        password: 'Test@123',
        name: 'Sandil1 Adhikari',
        role: USER_ROLE.USER,
        isActive: true,
      },
      {
        email: 'sandil2@gmail.com',
        password: 'Test@123',
        name: 'Sandil2 Adhikari',
        role: USER_ROLE.USER,
        isActive: true,
      },
    ];

    const otherUsers = usersRepository.create([
      ...moreUsers,
      ...otherUsersArray,
    ]);

    await usersRepository.save(otherUsers);
    console.log('users seed success');
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

/**************************
 ** This is groups seeder **
 **************************/
export async function seedGroups(
  usersRepository: Repository<UserEntity>,
  groupsRepository: Repository<GroupEntity>,
) {
  try {
    const groupAdmin = await usersRepository.findOne({
      where: {
        id: In(Array.from({ length: 100 }, (_, idx) => idx + 1)),
      },
    });
    const groupMembers = await usersRepository.find({
      take: 4,
    });

    if (
      !groupAdmin ||
      !groupMembers ||
      (groupMembers && groupMembers.length < 2)
    ) {
      throw new Error('seed users first');
    }

    const existingGroups = await groupsRepository.find({});

    if (existingGroups.length >= 3) {
      return;
    }

    const newGroups = Array.from(
      {
        length: 3 - existingGroups.length,
      },
      (_, idx) => ({
        name: `my-group-${idx + 1}`,
        groupAdmin,
        members: groupMembers,
      }),
    );

    const createdGroups = groupsRepository.create(newGroups);
    await groupsRepository.save(createdGroups);

    console.log('groups seed success');
  } catch (error) {
    throw new Error(error);
  }
}

/*********************************
 ** This is users_groups seeder **
 *********************************/
export async function seedGroupsUsers(
  usersRepository: Repository<UserEntity>,
  groupsRepository: Repository<GroupEntity>,
  usersGroupsRepository: Repository<UserGroupEntity>,
) {
  try {
    const usersGroupsData = await usersGroupsRepository.find({ take: 1 });

    if (usersGroupsData && usersGroupsData.length >= 1) {
      console.log('users_groups seed success');
      return;
    }

    const lengthOfGroups = 3,
      lengthOfMembers = 3;
    const prepatedData: Pick<UserGroupEntity, 'group' | 'member'>[] = [];

    const [groups, members] = await Promise.all([
      groupsRepository.find({
        take: lengthOfGroups,
      }),
      usersRepository.find({ take: lengthOfMembers }),
    ]);

    for (let i = 0; i < lengthOfGroups; i++) {
      for (let j = 0; j < lengthOfMembers; j++) {
        prepatedData.push({
          group: groups[i],
          member: members[j],
        });
      }
    }

    const createdData = usersGroupsRepository.create(prepatedData);
    await usersGroupsRepository.save(createdData);

    console.log('users_groups seed success');
  } catch (error) {
    throw new Error(error);
  }
}
