import { Context } from "../index";

interface ProfileParentType {
  id: number;
  bio: string;
  userId: number;
}

export const Profile = {
  user: (
    { id, bio, userId }: ProfileParentType,
    __: any,
    { prisma, userInfo }: Context
  ) => {
    return prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
  },
};
