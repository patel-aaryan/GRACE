import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(`${origin}/auth/login?error=auth_error`);
    }

    if (data.user) {
      // Check if user has completed their profile by calling the backend
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session.session) {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
            }/profile/check`,
            {
              headers: {
                Authorization: `Bearer ${session.session.access_token}`,
              },
            }
          );

          if (response.ok) {
            const result = await response.json();
            if (result.profile_complete) return NextResponse.redirect(origin);
          }
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }

      // Profile doesn't exist or isn't complete, redirect to profile completion
      return NextResponse.redirect(`${origin}/auth/complete-profile`);
    }
  }

  // Fallback redirect
  return NextResponse.redirect(`${origin}/auth/login`);
}
