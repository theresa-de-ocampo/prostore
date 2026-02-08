import { auth } from "@/auth";
import PersonalInfoForm from "./personal-info-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "Profile"
};

export default async function ProfilePage() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <section className="space-y-4">
        <h2>Account Settings</h2>
        <Card className=" max-w-xl">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalInfoForm />
          </CardContent>
        </Card>
      </section>
    </SessionProvider>
  );
}
