import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.id) redirect("/feed");

  return (
    <section className="mx-auto max-w-3xl py-20 text-center">
      <h1 className="text-5xl font-bold">Scentra</h1>
      <p className="mt-4 text-lg text-muted-foreground">Track your fragrances, share WOTD, and get weather-smart recommendations.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/signup"><Button>Get started</Button></Link>
        <Link href="/explore"><Button variant="outline">Explore catalog</Button></Link>
      </div>
    </section>
  );
}
