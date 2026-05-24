"use client";

import { useState } from "react";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = await response.json();
    setMessage(payload.message ?? "Account created. Please sign in.");
    if (response.ok) {
      event.currentTarget.reset();
    }

    setLoading(false);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <input
        className="w-full rounded-md border border-zinc-300 px-3 py-2"
        name="name"
        placeholder="Full name"
        required
      />
      <input
        className="w-full rounded-md border border-zinc-300 px-3 py-2"
        name="email"
        placeholder="Email"
        type="email"
        required
      />
      <input
        className="w-full rounded-md border border-zinc-300 px-3 py-2"
        name="password"
        placeholder="Password"
        type="password"
        minLength={8}
        required
      />
      <button
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
      {message ? <p className="text-sm text-zinc-700">{message}</p> : null}
    </form>
  );
}
