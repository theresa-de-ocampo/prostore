import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalInfoForm from "./personal-info-form";

export const metadata = {
  title: "Profile"
};

export default async function ProfilePage() {
  return (
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
  );
}
