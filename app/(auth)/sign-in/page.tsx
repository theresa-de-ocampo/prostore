import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Sign In"
};

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt={APP_NAME}
            width={100}
            height={100}
          />
        </Link>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
        <CardContent></CardContent>
      </CardHeader>
    </Card>
  );
}
