import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Providers } from "@/app/providers";
import { SignOutButton } from "@/app/components/auth-buttons";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anime Website",
  description: "Anime streaming platform for licensed content",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-zinc-100 text-zinc-900">
        <Providers>
          <header className="border-b border-zinc-200 bg-white">
            <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
              <Link className="text-lg font-semibold" href="/">
                Anime Website
              </Link>
              <div className="flex items-center gap-3 text-sm">
                <Link href="/anime" className="hover:underline">
                  Catalog
                </Link>
                {session?.user ? (
                  <>
                    <Link href="/dashboard" className="hover:underline">
                      Dashboard
                    </Link>
                    {session.user.role === "ADMIN" ? (
                      <Link href="/admin" className="hover:underline">
                        Admin
                      </Link>
                    ) : null}
                    <SignOutButton />
                  </>
                ) : (
                  <Link href="/auth/login" className="rounded-md bg-zinc-900 px-3 py-2 text-white">
                    Sign in
                  </Link>
                )}
              </div>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
