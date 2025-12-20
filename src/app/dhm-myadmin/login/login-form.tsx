'use client';

import { login } from "@/app/actions/auth";
import { useActionState, useState } from "react";

const initialState = {
  error: "",
};

export type LoginMode = 'admin' | 'internal';

export function LoginForm() {
  const [mode, setMode] = useState<LoginMode>('internal');
  const [state, formAction, isPending] = useActionState(async (_: any, formData: FormData) => {
      return await login(formData);
  }, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-navy/10 blur-3xl"></div>
      <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-brand-red/5 blur-3xl"></div>
      <div className="absolute bottom-0 right-1/3 h-96 w-96 rounded-full bg-brand-sky/40 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="overflow-hidden rounded-2xl bg-white/80 p-10 shadow-2xl backdrop-blur-sm border border-white/50 ring-1 ring-slate-900/5">
          <div className="flex flex-col items-center mb-8">
            {/* Logo can be re-enabled here if needed */}
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-800">
              {mode === 'admin' ? 'Admin Dashboard' : 'Internal Tooling'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === 'admin' ? 'Sign in to manage content' : 'Book rooms and cars for your team'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6 relative">
            <div className="flex rounded-full bg-gradient-to-r from-[#2E388C] to-[#3d4ba3] p-1 shadow-lg">
              <button
                type="button"
                onClick={() => setMode('internal')}
                className={`flex-1 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  mode === 'internal'
                    ? 'bg-white text-[#2E388C] shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Internal Tooling
              </button>
              <button
                type="button"
                onClick={() => setMode('admin')}
                className={`flex-1 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  mode === 'admin'
                    ? 'bg-white text-[#2E388C] shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="mode" value={mode} />
            <div className="space-y-5">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium leading-6 text-slate-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-lg border-0 bg-slate-50 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-brand-navy sm:text-sm sm:leading-6 transition-all duration-200"
                    placeholder="admin@dhinimex.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-lg border-0 bg-slate-50 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-brand-navy sm:text-sm sm:leading-6 transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {state?.error && (
              <div className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600 ring-1 ring-inset ring-red-100 animate-pulse">
                {state.error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex w-full justify-center rounded-lg bg-brand-navy px-4 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-brand-navy/90 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.98]"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Dhinimex Co., Ltd. All rights reserved.
        </div>
      </div>
    </div>
  );
}

