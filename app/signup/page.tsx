import Link from "next/link";
import { redirect } from "next/navigation";
import { signupAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <form
      action={async (formData) => {
        "use server";
        const result = await signupAction({
          email: formData.get("email"),
          password: formData.get("password"),
          username: formData.get("username"),
          displayName: formData.get("displayName")
        });
        if (!result.error) redirect("/login");
      }}
      className="mx-auto max-w-md space-y-4 rounded-xl border p-6"
    >
      <h1 className="text-2xl font-semibold">Create account</h1>
      <Input name="displayName" placeholder="Display name" required />
      <Input name="username" placeholder="Username" required />
      <Input name="email" placeholder="Email" type="email" required />
      <Input name="password" placeholder="Password" type="password" required />
      <Button type="submit" className="w-full">Sign up</Button>
      <p className="text-sm text-muted-foreground">Already have an account? <Link href="/login" className="underline">Login</Link></p>
    </form>
  );
}
