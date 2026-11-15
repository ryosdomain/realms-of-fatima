"use client";

import React, { useState } from "react";
import { login } from "./actions";
import Logo from "@/components/Logo";
import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  Eye,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";   

const page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter()
  const formHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget; 
    const formData = new FormData(form);
    const result = await login(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
        return;    
    }
    form.reset()
    router.replace("/admin")
  };
  return (
    <div className="grid min-h-screen bg-[#f4efe5] lg:grid-cols-[1.08fr_0.92fr]">
      <div className="relative hidden overflow-hidden bg-[#183a31] p-12 text-[#f5efe3] lg:flex lg:flex-col lg:justify-between">
        <div className="paper-grain absolute inset-0 opacity-10" />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative max-w-147.5">
          <div className="mb-8 flex size-12 items-center justify-center rounded-full border border-white/20">
            <Sparkles size={20} className="text-[#d8ae69]" />
          </div>
          <blockquote className="font-serif text-[clamp(2.8rem,4.5vw,5rem)] leading-[0.98] tracking-[-0.045em]">
            “A word after a word after a word is power.”
          </blockquote>
          <p className="mt-7 text-sm text-white/55">— Margaret Atwood</p>
        </div>
        <p className="relative text-xs text-white/35">
          A quiet place to shape remarkable stories.
        </p>
      </div>
      <div className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-[#52635d] hover:text-[#183a31]"
          >
            <ArrowLeft size={15} /> Back to website
          </Link>
        </div>
        <div className="m-auto w-full max-w-105 py-12">
          <div className="mb-9 grid size-12 place-items-center rounded-2xl bg-[#e6ddca] text-[#183a31]">
            <LockKeyhole size={21} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a45134]">
            Private author studio
          </p>
          <h1 className="mt-3 font-serif text-5xl tracking-[-0.04em] text-[#183a31]">
            Welcome back.
          </h1>
          <p className="mt-4 text-sm leading-6 text-[#6e7771]">
            Sign in to manage your books, pages, and featured story.
          </p>
          <form onSubmit={formHandler} className="mt-10 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#344740]">
                Email address
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-13 w-full rounded-xl border border-[#18382f]/25 bg-white/55 px-4 text-sm outline-none transition focus:border-[#a45134] focus:ring-3 focus:ring-[#a45134]/10"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#344740]">
                Password
              </span>
              <span className="flex h-13 items-center rounded-xl border border-[#18382f]/25 bg-white/55 pr-3 transition focus-within:border-[#a45134] focus-within:ring-3 focus-within:ring-[#a45134]/10">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Your password"
                  className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="grid size-9 place-items-center rounded-lg text-[#728079] hover:bg-[#18382f]/5"
                  aria-label="Toggle password visibility"
                >
                  <Eye size={17} />
                </button>
              </span>
            </label>
            <div className="flex items-center justify-between">
              {/* <label className="flex items-center gap-2 text-xs text-[#5d6b65]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-[#183a31]"
                />{" "}
                Keep me signed in
              </label> */}
              {/* <button
                type="button"
                className="text-xs font-semibold text-[#a45134]"
              >
                Forgot password?
              </button> */}
            </div>
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700"
              >
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={pending}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#183a31] text-sm font-semibold text-white transition hover:bg-[#234c41] disabled:opacity-60"
            >
              {pending ? (
                "Signing in..."
              ) : (
                <>
                  Enter the studio <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#18382f]/10 bg-[#ece5d7]/55 p-4 text-xs leading-5 text-[#65716c]">
            <CircleHelp size={16} className="mt-0.5 shrink-0" />
            This studio is invitation-only. Contact the site owner if you need
            access.
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
