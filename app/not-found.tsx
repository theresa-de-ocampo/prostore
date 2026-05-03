import PageState from "@/components/shared/page-state";

export default function NotFound() {
  return (
    <PageState
      title="Page Not Found"
      link={{ label: "Back to Home", href: "/" }}
    />
  );
}
