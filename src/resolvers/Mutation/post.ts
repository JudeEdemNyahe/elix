import { Post, Prisma } from "@prisma/client";
import { Context } from "../../index";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post, never> | null;
}

export const postResolvers = {
  postCreate: async (
    _: any,
    { post }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated user)",
          },
        ],
        post: null,
      };
    }

    const { title, content } = post;
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "you must provide title and content to create a post",
          },
        ],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorID: userInfo.userId,
        },
      }),
    };
  },

  postUpdate: async (
    _: any,
    { post, postId }: { postId: string; post: PostArgs["post"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated user)",
          },
        ],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    const { title, content } = post;
    //check if at least a field is provided
    if (!title && !content) {
      return {
        userErrors: [
          {
            message:
              "Please provide at least one field for either title or content",
          },
        ],
        post: null,
      };
    }

    //check if post exist
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }
    let payloadToUpdate = {
      title,
      content,
    };

    if (!title) delete payloadToUpdate.title;
    if (!content) delete payloadToUpdate.content;

    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          ...payloadToUpdate,
        },
        where: {
          id: Number(postId),
        },
      }),
    };
  },

  postDelete: async (
    _: any,
    { postId }: { postId: String },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated user)",
          },
        ],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!post) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }

    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return {
      userErrors: [],
      post,
    };
  },

  postPublish: async (
    _: any,
    { postId }: { postId: string; post: PostArgs["post"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated user)",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          published: true,
        },
        where: {
          id: Number(postId),
        },
      }),
    };
  },

  postUnpublish: async (
    _: any,
    { postId }: { postId: string; post: PostArgs["post"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated user)",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          published: false,
        },
        where: {
          id: Number(postId),
        },
      }),
    };
  },
};
