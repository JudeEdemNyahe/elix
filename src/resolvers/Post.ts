import { Context } from "../index";
interface PostParentType {
  authorID: number;
}

export const Post = {
  user: (parent: PostParentType, __: any, { prisma }: Context) => {
    return prisma.user.findUnique({
      where: {
        id: parent.authorID,
      },
    });
  },
};
