import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/ProfileForm";

async function Profile() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ProfileForm user={{ name: String(user?.user_metadata?.name ?? ""), email: user?.email ?? "" }} />;
}

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-[#f4f1ea] text-[#263832]">
      
      <div className="min-w-0 flex-1">
       
        <main className="mx-auto max-w-295 p-5 md:p-8">
          <h2 className="font-serif text-4xl tracking-[-0.035em] text-[#183a31]">Settings</h2>
          <p className="mt-2 text-sm text-[#74807a]">Your name and password.</p>
          <div className="mt-8 max-w-lg">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-white" />}>
              <Profile />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}