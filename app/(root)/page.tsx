import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Home"
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Home() {
  await sleep(3_000);

  return (
    <main>
      <p className="font-inter">ProStore</p>
      <p>ProStore</p>
      <Button>Save</Button>
    </main>
  );
}
