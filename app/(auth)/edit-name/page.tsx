"use client";

import { useSession } from "next-auth/react";
import { editUser } from "@/lib/actions/user.actions";

/**
 * This component demonstrates how to update the user session in NextAuth.js.
 * It allows the user to change their name, which triggers a session update.
 * The session update is handled in the auth.ts configuration, specifically in the
 * JWT callback where the 'update' trigger is processed to refresh the token.
 *
 * Key features:
 * - Uses NextAuth's useSession hook to access and update session data.
 * - Calls the editUser server action to persist the name change in the database.
 * - Invokes update() to refresh the client-side session, which communicates with
 *   the auth.ts callbacks to update the JWT and session.
 *
 * This is for demonstration purposes only.
 */
export default function EditName() {
  const { data, status, update } = useSession();

  async function submit() {
    if (data?.user?.id) {
      await editUser(data.user.id, { name: "Alexander" });
      update({ name: "Alexander" });
    }
  }
  return (
    <div>
      {status === "authenticated" && (
        <>
          <p>{data?.user?.name}</p>
          <button onClick={submit}>Edit Name</button>
        </>
      )}
    </div>
  );
}
