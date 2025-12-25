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
import SignUpForm from "./sign-up-form";

import { auth } from "@/auth";

export const metadata = {
  title: "Sign Up"
};

export default async function SignUpPage(props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
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
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          By creating an account, you agree to our Terms and have read and
          acknowledged the Global Privacy Statement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  );
}
