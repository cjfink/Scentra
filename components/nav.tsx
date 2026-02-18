import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function Nav() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-20 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link
          href="/"
          className="font-serif text-3xl font-semibold tracking-tight text-primary"
        >
          Scentra
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium text-muted-foreground">
          <Link
            className="transition-colors hover:text-foreground"
            href="/feed"
          >
            Feed
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="/explore"
          >
            Explore
          </Link>
          {session?.user?.id && (
            <Link
              className="transition-colors hover:text-foreground"
              href="/collection"
            >
              Collection
            </Link>
          )}
          {session?.user?.id && (
            <Link
              className="transition-colors hover:text-foreground"
              href="/wear-today"
            >
              Wear Today
            </Link>
          )}
          {session?.user?.id ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button className="ml-1" variant="outline" type="submit">
                Sign out
              </Button>
            </form>
          ) : (
            <Link
              className="transition-colors hover:text-foreground"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
