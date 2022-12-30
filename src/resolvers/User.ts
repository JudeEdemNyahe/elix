import { Context } from "../index";
interface PostParentType {
  postId: number;
}

export const User = {
  posts: (
    parent: PostParentType,
    { take, skip }: { take: number; skip: number },
    { prisma, userInfo }: Context
  ) => {
    const isOwnProfile = parent.postId === userInfo?.userId;

    if (isOwnProfile) {
      return prisma.post.findMany({
        where: {
          id: parent.postId,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        skip,
        take,
      });
    } else {
      return prisma.post.findMany({
        where: {
          id: parent.postId,
          published: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        skip,
        take,
      });
    }
  },
};
