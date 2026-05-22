'use client';

import { login } from "@/app/actions/auth";
import { useLanguage } from "@/lib/i18n";
import { useActionState, useMemo } from "react";

const initialState = { error: "" };

const SERVER_ERROR_TO_KEY: Record<string, keyof typeof import("@/data/translations").translations.en.admin.login.errors> = {
  "Username is required.": "usernameRequired",
  "This account has been deactivated. Contact your administrator.": "deactivated",
  "Invalid credentials": "invalidCredentials",
};

export function LoginForm() {
  const { t } = useLanguage();
  const l = t.admin.login;

  const translateError = useMemo(
    () => (message: string) => {
      const key = SERVER_ERROR_TO_KEY[message];
      return key ? l.errors[key] : message;
    },
    [l.errors],
  );

  const [state, formAction, isPending] = useActionState(async (_: unknown, formData: FormData) => {
    return await login(formData);
  }, initialState);

  return (
    <div className="relative flex min-h-screen min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-100 px-4 py-8">
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-navy/10 blur-3xl" />
      <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-brand-red/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/3 h-96 w-96 rounded-full bg-brand-sky/40 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-6 shadow-2xl backdrop-blur-sm ring-1 ring-slate-900/5 sm:p-10">
          <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">{l.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{l.subtitle}</p>
          </div>

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="mode" value="admin" />

            <div className="space-y-5">
              <div>
                <label htmlFor="login-username" className="mb-1.5 block text-sm font-medium leading-6 text-slate-700">
                  {l.username}
                </label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder={l.usernamePlaceholder}
                  className="block w-full rounded-lg border-0 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-brand-navy sm:text-sm sm:leading-6"
                />
                <p className="mt-1.5 text-xs text-slate-400">{l.usernameHint}</p>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium leading-6 text-slate-700">
                  {l.password}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-lg border-0 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-brand-navy sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {state?.error ? (
              <div className="animate-pulse rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600 ring-1 ring-inset ring-red-100">
                {translateError(state.error)}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center rounded-lg bg-brand-navy px-4 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-brand-navy/90 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {l.signingIn}
                </span>
              ) : (
                l.signIn
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          {l.copyright.replace("{year}", String(new Date().getFullYear()))}
        </div>
      </div>
    </div>
  );
}
