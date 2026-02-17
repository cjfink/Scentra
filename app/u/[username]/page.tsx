import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      collection: { include: { fragrance: true }, take: 6 },
      wotdPosts: { include: { fragrance: true }, orderBy: { createdAt: "desc" }, take: 5 }
    }
  });
  if (!user) return <div>User not found.</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted" />
          <div>
            <h1 className="text-2xl font-semibold">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>
        <p className="mt-4">{user.bio}</p>
        <div className="mt-3 flex flex-wrap gap-2">{user.styleTags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Collection Preview</h2>
          <Link href={`/u/${user.username}/collection`} className="text-sm underline">View all</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {user.collection.map((item) => (
            <div className="rounded-xl border p-3" key={item.id}>
              <Image src={item.fragrance.thumbnailUrl ?? item.fragrance.imageUrl} alt={item.fragrance.name} width={200} height={120} className="h-28 w-full rounded object-cover" />
              <p className="mt-2 text-sm font-medium">{item.fragrance.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold">Recent WOTD</h2>
        <div className="space-y-2">
          {user.wotdPosts.map((post) => (
            <div key={post.id} className="rounded-xl border p-3 text-sm">{post.fragrance.name} — {post.caption}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
