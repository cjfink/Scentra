import "./globals.css";
import { Nav } from "@/components/nav";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto min-h-[calc(100vh-68px)] w-full max-w-6xl px-4 py-10 sm:py-14">
          {children}
        </main>
      </body>
    </html>
  );
}
