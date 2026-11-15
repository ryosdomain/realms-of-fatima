"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, LogOut, Menu, UserRound, X } from "lucide-react";
import { logout } from "@/app/admin/actions";
import ProfileForm from "@/components/ProfileForm";

type User = { name: string; email: string };

const initialsOf = (u: User) => {
  const source = u.name.trim() || u.email.split("@")[0] || "?";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

export default function AdminHeaderClient({
  today,
  user,
  nav,
}: {
  today: string;
  user: User;
  nav: React.ReactNode;
}) {
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState(false);

  // Escape closes whatever is open
  useEffect(() => {
    if (!drawer && !menu && !profile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDrawer(false);
      setMenu(false);
      setProfile(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer, menu, profile]);

  return (
    <>
      <header className="flex h-18 items-center justify-between border-b border-[#18382f]/10 bg-[#faf8f3] px-5 md:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            className="grid size-10 place-items-center rounded-xl border border-[#18382f]/10 lg:hidden"
          >
            <Menu size={19} />
          </button>
          <div>
            <h1 className="font-serif text-xl text-[#183a31]">Author studio</h1>
            {today && <p className="hidden text-[11px] text-[#87908b] sm:block">{today}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-2 rounded-xl border border-[#18382f]/12 px-4 py-2.5 text-xs font-semibold sm:flex"
          >
            <Eye size={15} /> Preview site
          </Link>

          {/* account menu */}
          <div className="relative">
            <button
              onClick={() => setMenu(!menu)}
              aria-label="Account menu"
              aria-expanded={menu}
              className="grid size-9 place-items-center rounded-full bg-[#a45134] font-serif text-sm text-white transition hover:ring-4 hover:ring-[#a45134]/20"
            >
              {initialsOf(user)}
            </button>

            {menu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenu(false)} />
                <div className="absolute right-0 top-12 z-40 w-64 rounded-2xl border border-[#d6cfbf] bg-white p-1.5 shadow-xl">
                  <div className="px-3 py-3">
                    <p className="truncate text-sm font-semibold text-[#183a31]">{user.name || "Your account"}</p>
                    <p className="truncate text-xs text-[#87908b]">{user.email}</p>
                  </div>
                  <div className="my-1 h-px bg-[#d6cfbf]" />
                  <button
                    onClick={() => {
                      setMenu(false);
                      setProfile(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#32453f] hover:bg-[#f4f1ea]"
                  >
                    <UserRound size={14} className="text-[#a45134]" /> Edit profile & password
                  </button>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#a45134] hover:bg-[#fff5f1]"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* mobile sidebar drawer */}
      <div className="lg:hidden">
        {drawer && (
          <div
            className="fixed inset-0 z-40 bg-[#11251f]/45 backdrop-blur-[2px]"
            onClick={() => setDrawer(false)}
          />
        )}
        <aside
          inert={!drawer}
          onClick={(e) => {
            // tapping a link closes the drawer
            if ((e.target as HTMLElement).closest("a")) setDrawer(false);
          }}
          className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-[#17382f] px-4 py-6 text-white shadow-2xl transition-transform duration-300 ${
            drawer ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setDrawer(false)}
            aria-label="Close menu"
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-white/70 hover:bg-white/10"
          >
            <X size={18} />
          </button>
          {nav}
        </aside>
      </div>

      {/* profile dialog */}
      {profile && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#11251f]/40 p-4 backdrop-blur-[2px]"
          onMouseDown={() => setProfile(false)}
        >
          <div
            className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-[#fbf9f4] p-6 shadow-2xl md:p-7"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a45134]">Account</p>
                <h2 className="mt-1 font-serif text-2xl text-[#183a31]">Your profile</h2>
              </div>
              <button
                onClick={() => setProfile(false)}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-full border border-[#18382f]/10"
              >
                <X size={16} />
              </button>
            </div>
            <ProfileForm user={user} />
          </div>
        </div>
      )}
    </>
  );
}