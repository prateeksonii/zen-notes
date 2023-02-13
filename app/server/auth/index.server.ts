import { User } from "@prisma/client";
import * as argon2 from "argon2";
import { db } from "../prisma";
import { signUpValidator } from "../validators/authValidator.server";

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

  const hashedPassword = await argon2.hash(result.data.password, {
    type: argon2.argon2id,
    parallelism: 1,
    saltLength: 16,
  });

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

    await db.user.create({
      data: {
        ...result.data,
        password: hashedPassword,
      },
    });
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      values: result.data,
      formErrors: null,
      code: 500,
    };
  }

  return {
    success: true,
    error: null,
    values: result.data,
    formErrors: null,
    code: 201,
  };
}
