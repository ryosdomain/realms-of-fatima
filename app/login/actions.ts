"use server";

import { createClient } from "@/lib/supabase/server";

export const login = async (
  formData: FormData,
): Promise<{ error: string } | undefined> => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    if (error.code === "invalid_credentials") {
      return { error: "Incorrect email or password." };
    }
    if (error.code === "email_not_confirmed") {
      return { error: "This account hasn't been confirmed yet." };
    }
    return { error: "Authentication failed. Please try again." };
  }
};
