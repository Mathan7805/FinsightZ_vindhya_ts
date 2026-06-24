import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Simple hash using Web Crypto (SHA-256) — adequate for an internal app.
// For production, consider bcrypt via a native module.
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const loginUser = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().min(1),
      })
      .parse(d)
  )
  .handler(async ({ data }) => {
    const { email, password } = data;

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error || !user) {
      return { ok: false as const, error: "Invalid email or password" };
    }

    const inputHash = await hashPassword(password);
    if (inputHash !== user.password_hash) {
      return { ok: false as const, error: "Invalid email or password" };
    }

    return {
      ok: true as const,
      user: {
        id: user.id,
        email: user.email,
        persona: user.persona,
        name: user.name,
        mustChangePassword: user.must_change_password,
      },
    };
  });

export const changePassword = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        email: z.string().email(),
        currentPassword: z.string().min(1),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
      })
      .parse(d)
  )
  .handler(async ({ data }) => {
    const { email, currentPassword, newPassword } = data;

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error || !user) {
      return { ok: false as const, error: "User not found" };
    }

    const currentHash = await hashPassword(currentPassword);
    if (currentHash !== user.password_hash) {
      return { ok: false as const, error: "Current password is incorrect" };
    }

    if (currentPassword === newPassword) {
      return { ok: false as const, error: "New password must be different from current password" };
    }

    const newHash = await hashPassword(newPassword);

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        password_hash: newHash,
        must_change_password: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return { ok: false as const, error: "Failed to update password" };
    }

    return {
      ok: true as const,
      user: {
        id: user.id,
        email: user.email,
        persona: user.persona,
        name: user.name,
        mustChangePassword: false,
      },
    };
  });
