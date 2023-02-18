import { User } from "@prisma/client";
import * as argon2 from "argon2";
import { sessionStorage } from "~/services/session.server";
import { db } from "../prisma";
import {
  signInValidator,
  signUpValidator,
} from "../validators/authValidator.server";

export async function signUp(userDto: Partial<User>) {
  const result = signUpValidator.safeParse(userDto);
  if (!result.success) {
    return {
      success: false,
      formErrors: result.error.format(),
      error: "Bad request",
      values: userDto,
      code: 400,
    };
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
    });

    if (user) {
      return {
        success: false,
        error: "User already exists",
        values: result.data,
        formErrors: null,
        code: 409,
      };
    }

    const hashedPassword = await argon2.hash(result.data.password, {
      type: argon2.argon2id,
      parallelism: 1,
      saltLength: 16,
    });

    await db.user.create({
      data: {
        ...result.data,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      error: null,
      values: result.data,
      formErrors: null,
      code: 201,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      values: result.data,
      formErrors: null,
      code: 500,
    };
  }
}

export async function signIn(userDto: Partial<User>) {
  const result = signInValidator.safeParse(userDto);
  if (!result.success) {
    return {
      success: false,
      formErrors: result.error.format(),
      error: "Bad request",
      values: userDto,
      code: 400,
    };
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User does not exist",
        values: result.data,
        formErrors: null,
        code: 404,
      };
    }

    const isValid = await argon2.verify(user.password, result.data.password);

    if (!isValid) {
      return {
        success: false,
        error: "Invalid email or password",
        values: result.data,
        formErrors: null,
        code: 400,
      };
    }

    return {
      success: true,
      error: null,
      values: result.data,
      formErrors: null,
      code: 200,
      data: user.id,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      values: result.data,
      formErrors: null,
      code: 500,
    };
  }
}
