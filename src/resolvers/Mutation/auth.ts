import { Context } from "../../index";
import validator from "validator";
import brcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JSON_SIGNATURE } from "../../keys";

interface SignupArgs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

interface SignInArgs {
  credentials: {
    email: string;
    password: string;
  };
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials, name, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;

    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "Invalid email",
          },
        ],
        token: null,
      };
    }
    const isValidPassword = validator.isLength(password, {
      min: 5,
    });

    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: "Password should be at least 5 characters long",
          },
        ],
        token: null,
      };
    }
    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "name and bio is required",
          },
        ],
        token: null,
      };
    }
    const hashedPassword = await brcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });
    const token = await JWT.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JSON_SIGNATURE,
      {
        expiresIn: 3600000,
      }
    );

    return {
      userErrors: [],
      token,
    };
  },

  signin: async (
    _: any,
    { credentials }: SignInArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;

    if (!email || !password) {
      return {
        userErrors: [
          {
            message: "All fields are required",
          },
        ],
        token: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        userErrors: [
          {
            message: "User does not exits.Please signup",
          },
        ],
        token: null,
      };
    }

    const isMatch = await brcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        userErrors: [
          {
            message: "wrong email or password",
          },
        ],
        token: null,
      };
    }

    const token = JWT.sign(
      {
        userId: user.id,
      },
      JSON_SIGNATURE,
      {
        expiresIn: 3600000,
      }
    );

    return {
      userErrors: [],
      token,
    };
  },
};
