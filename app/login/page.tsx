import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("credentials", {
          email: formData.get("email"),
          password: formData.get("password"),
          redirectTo: "/feed"
        });
      }}
      className="mx-auto max-w-md space-y-4 rounded-xl border p-6"
    >
      <h1 className="text-2xl font-semibold">Login</h1>
      <Input name="email" placeholder="Email" type="email" required />
      <Input name="password" placeholder="Password" type="password" required />
      <Button type="submit" className="w-full">Sign in</Button>
    </form>
  );
}
