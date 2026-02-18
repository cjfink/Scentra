"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FollowButton({
  userId,
  initialFollowing,
}: {
  userId: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function toggleFollow() {
    setLoading(true);
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      const data = (await res.json()) as { following: boolean };
      setFollowing(data.following);
    }
    setLoading(false);
  }

  return (
    <Button
      onClick={toggleFollow}
      disabled={loading}
      variant={following ? "outline" : "default"}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
