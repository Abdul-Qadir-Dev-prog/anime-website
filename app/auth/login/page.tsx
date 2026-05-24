import Link from "next/link";
import { LoginForm } from "@/app/components/login-form";
import { RegisterForm } from "@/app/components/register-form";

export default function LoginPage() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
  const appleEnabled = Boolean(
    process.env.APPLE_ID &&
      process.env.APPLE_SECRET &&
      process.env.APPLE_TEAM_ID &&
      process.env.APPLE_KEY_ID,
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mb-4 mt-2 text-sm text-zinc-600">
          Sign in with Google, Apple, or your email/password credentials.
        </p>
        <LoginForm googleEnabled={googleEnabled} appleEnabled={appleEnabled} />
      </section>
      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-2xl font-semibold">Create account</h2>
        <p className="mb-4 mt-2 text-sm text-zinc-600">
          Optional direct registration for email/password authentication.
        </p>
        <RegisterForm />
        <p className="mt-4 text-xs text-zinc-500">
          Admin users are controlled via role in database or ADMIN_EMAILS env configuration.
        </p>
        <p className="mt-3 text-sm">
          <Link href="/anime" className="text-zinc-900 underline">
            Continue to catalog
          </Link>
        </p>
      </section>
    </div>
  );
}
