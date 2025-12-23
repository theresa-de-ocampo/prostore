import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

// * Constants
import { APP_NAME } from "@/lib/constants";

// * Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import CredentialsSignInForm from "./credentials-sign-in-form";

import { auth } from "@/auth";

export const metadata = {
  title: "Sign In"
};

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    return redirect("/");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="gap-2">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt={APP_NAME}
            width={100}
            height={100}
            className="mx-auto"
            loading="eager"
          />
        </Link>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <CredentialsSignInForm />
      </CardContent>
    </Card>
  );
}
