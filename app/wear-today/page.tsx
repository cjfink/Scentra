import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { WearTodayClient } from "@/components/wear-today-client";

export default async function WearTodayPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return <WearTodayClient />;
}
