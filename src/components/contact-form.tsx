"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("success");
    setForm(initialState);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Full name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
        />
        <FormField
          label="Subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
        />
      </div>
      <FormArea
        label="Project details"
        name="message"
        rows={5}
        value={form.message}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand-red px-6 py-3 font-semibold text-white transition hover:bg-brand-red/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
      {status === "success" && (
        <p className="text-sm font-semibold text-green-600" role="status">
          Thanks for reaching out! A Dhinimex representative will respond soon.
        </p>
      )}
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

function FormField({ label, name, type = "text", value, onChange, required }: FieldProps) {
  return (
    <label className="text-sm font-semibold text-brand-navy">
      <span>{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-700 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red/40"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  );
}

type AreaProps = {
  label: string;
  name: string;
  rows: number;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
};

function FormArea({ label, name, rows, value, onChange, required }: AreaProps) {
  return (
    <label className="block text-sm font-semibold text-brand-navy">
      <span>{label}</span>
      <textarea
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-700 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red/40"
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  );
}

