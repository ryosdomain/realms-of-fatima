"use client";

import { useActionState } from "react";
import { changePassword, updateName, type FormState } from "@/app/admin/profile-actions";

const field =
  "h-11 w-full rounded-xl border border-[#18382f]/25 bg-white px-4 text-sm outline-none transition focus:border-[#a45134] disabled:bg-[#f4f1ea] disabled:text-[#87908b]";
const label = "mb-1.5 block text-xs font-bold text-[#32453f]";
const button =
  "h-11 rounded-xl bg-[#183a31] px-5 text-sm font-semibold text-white transition hover:bg-[#214a3f] disabled:opacity-50";

function Message({ state }: { state: FormState }) {
  if (state.error)
    return (
      <p role="alert" className="rounded-xl border border-[#a45134]/30 bg-[#fff5f1] px-3 py-2 text-xs text-[#a45134]">
        {state.error}
      </p>
    );
  if (state.ok)
    return (
      <p role="status" className="rounded-xl border border-[#2c6a4a]/30 bg-[#e5f0e9] px-3 py-2 text-xs text-[#2c6a4a]">
        {state.ok}
      </p>
    );
  return null;
}

export default function ProfileForm({ user }: { user: { name: string; email: string } }) {
  const [nameState, nameAction, namePending] = useActionState(updateName, {});
  const [passState, passAction, passPending] = useActionState(changePassword, {});

  return (
    <div className="space-y-5">
      {/* name */}
      <section className="rounded-2xl border border-[#18382f]/20 shadow bg-white p-5">
        <h3 className="font-serif text-lg text-[#183a31]">Your name</h3>
        <p className="mt-1 text-xs text-[#78817b]">Shown in the studio header.</p>

        <form action={nameAction} key={user.name} className="mt-4 space-y-3">
          <label className="block">
            <span className={label}>Name</span>
            <input  name="name" defaultValue={user.name} required maxLength={60} placeholder="Your name" className={field} />
          </label>
          {/* <label className="block">
            <span className={label}>Email</span>
            <input  value={user.email} disabled readOnly className={field} />
          </label> */}
          <Message state={nameState} />
          <button disabled={namePending} className={button}>
            {namePending ? "Saving…" : "Save name"}
          </button>
        </form>
      </section>

      {/* password */}
      <section className="rounded-2xl border border-[#18382f]/20 shadow bg-white p-5">
        <h3 className="font-serif text-lg text-[#183a31]">Password</h3>
        <p className="mt-1 text-xs text-[#78817b]">Use at least 8 characters.</p>

        <form action={passAction} className="mt-4 space-y-3">
          <label className="block">
            <span className={label}>Current password</span>
            <input  name="current" type="password" required autoComplete="current-password" className={field} />
          </label>
          <label className="block">
            <span className={label}>New password</span>
            <input  name="next" type="password" required minLength={8} autoComplete="new-password" className={field} />
          </label>
          <label className="block">
            <span className={label}>Confirm new password</span>
            <input  name="confirm" type="password" required minLength={8} autoComplete="new-password" className={field} />
          </label>
          <Message state={passState} />
          <button disabled={passPending} className={button}>
            {passPending ? "Changing…" : "Change password"}
          </button>
        </form>
      </section>
    </div>
  );
}