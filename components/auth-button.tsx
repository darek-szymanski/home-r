import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {/* User Avatar */}
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt="User avatar"
            className="w-8 h-8 rounded-full border border-border"
          />
        )}
        {/* User Name or Email */}
        <span className="text-sm font-medium">
          Hey, {
            (() => {
              const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
              if (fullName) {
                // Extract first name only (split by space and take first part)
                return fullName.split(' ')[0];
              }
              // Fallback to email username if no name available
              return user.email?.split('@')[0];
            })()
          }!
        </span>
      </div>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
