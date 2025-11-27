'use client';

import { login } from "@/app/actions/auth";
import Image from "next/image";
import { useActionState } from "react";

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (_: any, formData: FormData) => {
      return await login(formData);
  }, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
        <div className="flex flex-col items-center">
          <Image
            src="/logo-dhinimex.png"
            alt="Dhinimex"
            width={200}
            height={60}
            className="h-auto w-48"
          />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h2>
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-brand-navy sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-brand-navy sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
          </div>

          {state?.error && (
            <div className="text-center text-sm font-medium text-red-600">
              {state.error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-md bg-brand-navy px-3 py-3 text-sm font-semibold text-white hover:bg-brand-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy disabled:opacity-70"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

