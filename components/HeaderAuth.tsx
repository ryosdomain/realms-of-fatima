import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import AuthLink from "./AuthLink";

export default async function HeaderAuth() {
  await connection(); // must come before getUser()
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AuthLink loggedIn={!!user} />;
}