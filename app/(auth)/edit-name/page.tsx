"use client";

import { useSession } from "next-auth/react";
import { editUser } from "@/lib/actions/user.actions";

export default function EditName() {
  const { data, status, update } = useSession();

  async function submit() {
    if (data?.user?.id) {
      await editUser(data.user.id, { name: "Hermione" });
      update({ name: "Hermione" });
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
