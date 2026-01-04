"use server";

import { auth, signIn, signOut } from "@/auth";
import {
  shippingAddressSchema,
  signInSchema,
  signUpSchema
} from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";

export async function signInWithCredentials(_: unknown, formData: FormData) {
  let response;

  try {
    const user = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password")
    });

    await signIn("credentials", user);

    response = { success: true, message: "Signed in successfully." };
  } catch (error) {
    if (isRedirectError(error)) {
      console.log("Redirect Error!");
      throw error;
    }

    response = { success: false, message: "Invalid email or password." };
  }

  return response;
}

export async function logOut() {
  await signOut();
}

export async function signUp(_: unknown, formData: FormData) {
  let response;

  try {
    const user = signUpSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword")
    });

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashSync(user.password, 10)
      }
    });

    await signIn("credentials", {
      email: user.email,
      password: user.password
    });

    response = { success: true, message: "User registered successfully." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    response = { success: false, message: formatError(error) };
  }

  return response;
}

export async function signUpV2(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  let response;
  try {
    const user = signUpSchema.parse(data);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashSync(user.password, 10)
      }
    });

    await signIn("credentials", {
      email: user.email,
      password: user.password
    });

    response = { success: true, message: "User registered successfully." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    response = { success: false, message: "User was not registered." };
  }

  return response;
}

export async function editUser(id: string, data: { name: string }) {
  let response;

  try {
    await prisma.user.update({
      where: { id },
      data
    });

    response = { success: true, message: "User updated successfully." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    response = { success: false, message: "User was not updated." };
  }

  return response;
}

export async function getUserById(userId: string) {
  return await prisma.user.findFirstOrThrow({
    where: { id: userId }
  });
}

export async function updateUserAddress(id: string, data: ShippingAddress) {
  let response;

  try {
    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: {
        id
      },
      data: {
        address
      }
    });

    response = { success: true, message: "User updated successfully." };
  } catch (error) {
    response = { success: false, message: formatError(error) };
  }

  return response;
}
