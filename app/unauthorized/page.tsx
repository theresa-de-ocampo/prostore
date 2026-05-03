import type { Metadata } from "next";
import PageState from "@/components/shared/page-state";

export const metadata: Metadata = {
  title: "Unauthorized"
};

export default function Unauthorized() {
  return (
    <PageState
      title="Unauthorized Access"
      link={{ label: "Back to Home", href: "/" }}
    />
  );
}
