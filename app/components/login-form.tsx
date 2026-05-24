"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type LoginFormProps = {
  googleEnabled: boolean;
  appleEnabled: boolean;
};

export function LoginForm({ googleEnabled, appleEnabled }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const response = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    if (response?.error) {
      setError("Invalid credentials. Please try again.");
      return;
    }

    window.location.href = response?.url ?? "/dashboard";
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700"
        type="submit"
      >
        Sign in with Email
      </button>
      {googleEnabled ? (
        <button
          className="w-full rounded-md border border-zinc-300 px-4 py-2 hover:bg-zinc-100"
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Continue with Google
        </button>
      ) : null}
      {appleEnabled ? (
        <button
          className="w-full rounded-md border border-zinc-300 px-4 py-2 hover:bg-zinc-100"
          type="button"
          onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}
        >
          Continue with Apple
        </button>
      ) : null}
    </form>
  );
}
