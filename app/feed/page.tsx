import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WotdForm } from "@/components/wotd-form";
import { Card } from "@/components/ui/card";

export default async function FeedPage() {
  const posts = await prisma.wotdPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, fragrance: true, likes: true, comments: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 2 } },
    take: 20
  });

  return (
    <div className="grid gap-6 md:grid-cols-[320px_1fr]">
      <WotdForm />
      <div className="space-y-4">
        {posts.length === 0 && <Card>Post your first WOTD.</Card>}
        {posts.map((post) => (
          <Card key={post.id}>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-muted" />
              <Link href={`/u/${post.user.username}`} className="font-medium">@{post.user.username}</Link>
            </div>
            <div className="flex items-center gap-4">
              <Image src={post.fragrance.imageUrl} alt={post.fragrance.name} width={70} height={70} className="rounded-md" />
              <div>
                <p className="font-semibold">{post.fragrance.name}</p>
                <p className="text-xs text-muted-foreground">{post.caption}</p>
                <p className="text-xs">{post.likes.length} likes • {post.comments.length} comments</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
