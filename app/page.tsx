import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.id) redirect("/feed");

  return (
    <section className="mx-auto max-w-4xl py-16 text-center sm:py-24">
      <p className="mx-auto w-fit rounded-full border border-border bg-card/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
        Crafted fragrance journaling
      </p>
      <h1 className="mt-6 text-5xl font-semibold text-primary sm:text-6xl">
        A refined home for your fragrance story.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Track your collection with elegance, share your scent of the day, and
        get weather-aware recommendations that feel tailored to you.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link href="/signup">
          <Button>Get started</Button>
        </Link>
        <Link href="/explore">
          <Button variant="outline">Explore catalog</Button>
        </Link>
      </div>
    </section>
  );
}
