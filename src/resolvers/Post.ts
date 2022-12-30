import { Context } from "../index";
import { userLoader } from "../loaders/userLoaders";
interface PostParentType {
  authorID: number;
}

export const Post = {
  user: (parent: PostParentType, __: any, { prisma }: Context) => {
    return userLoader.load(parent.authorID);
  },
};
