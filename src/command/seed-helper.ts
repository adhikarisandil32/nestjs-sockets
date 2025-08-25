import { USER_ROLE } from 'src/modules/users/constants/user.constant';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { GroupEntity } from 'src/modules/groups/entities/group.entity';

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
        isActive: Boolean(Math.round(Math.random())),
      }),
    );

    const otherUsers = usersRepository.create(otherUsersArray);

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

    const groups = Array.from(
      {
        length: 3 - existingGroups.length,
      },
      () => ({
        groupAdmin,
        users: groupMembers,
      }),
    );

    const newGroups = groupsRepository.create(groups);
    await groupsRepository.save(newGroups);

    console.log('groups seed success');
  } catch (error) {
    throw new Error(error);
  }
}
