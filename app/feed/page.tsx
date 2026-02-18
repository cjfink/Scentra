import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function FeedPage() {
  const session = await auth();

  let whereClause = {};
  if (session?.user?.id) {
    const followingRows = await prisma.follow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true },
    });
    whereClause = {
      userId: {
        in: [session.user.id, ...followingRows.map((row) => row.followingId)],
      },
    };
  }

  const posts = await prisma.wotdPost.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { user: true, fragrance: true },
    take: 20,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">WOTD Feed</h1>
        {session?.user?.id ? (
          <Link href="/wotd" className="text-sm underline">
            Create post
          </Link>
        ) : null}
      </div>
      {posts.length === 0 ? <Card>No posts yet.</Card> : null}
      {posts.map((post) => (
        <Card key={post.id}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <Link href={`/u/${post.user.username}`} className="font-medium">
              @{post.user.username}
            </Link>
            <p className="text-xs text-muted-foreground">
              {post.createdAt.toLocaleDateString()}{" "}
              {post.createdAt.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src={post.fragrance.thumbnailUrl ?? post.fragrance.imageUrl}
              alt={post.fragrance.name}
              width={70}
              height={70}
              className="rounded-md"
            />
            <div>
              <p className="font-semibold">{post.fragrance.name}</p>
              <p className="text-sm text-muted-foreground">
                {post.fragrance.brand}
              </p>
              {post.caption ? (
                <p className="mt-1 text-sm">{post.caption}</p>
              ) : null}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
