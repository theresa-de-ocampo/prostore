"use server";

import { signIn, signOut } from "@/auth";
import { signInSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function signInWithCredentials(_: unknown, formData: FormData) {
  try {
    const user = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password")
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully." };
  } catch (error) {
    if (isRedirectError(error)) {
      console.log("Redirect Error!");
      throw error;
    }

    return { success: false, message: "Invalid email or password." };
  }
}

export async function logOut() {
  await signOut();
}
