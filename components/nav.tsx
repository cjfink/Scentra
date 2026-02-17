import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function Nav() {
  const session = await auth();

  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-semibold">Scentra</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/feed">Feed</Link>
          <Link href="/explore">Explore</Link>
          {session?.user?.id && <Link href="/collection">Collection</Link>}
          {session?.user?.id && <Link href="/wear-today">Wear Today</Link>}
          {session?.user?.id ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button variant="outline" type="submit">Sign out</Button>
            </form>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
