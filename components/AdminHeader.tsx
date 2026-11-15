import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SidebarBody } from "@/components/SideBar";
import AdminHeaderClient from "@/components/AdminHeaderClient";

async function Loaded() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <AdminHeaderClient
      today={today}
      user={{ name: String(user?.user_metadata?.name ?? ""), email: user?.email ?? "" }}
      nav={<SidebarBody />}
    />
  );
}

export default function AdminHeader() {
  return (
    <Suspense fallback={<AdminHeaderClient today="" user={{ name: "", email: "" }} nav={<SidebarBody />} />}>
      <Loaded />
    </Suspense>
  );
}