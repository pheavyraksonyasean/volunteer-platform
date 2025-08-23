import ResetPasswordForm from "@/components/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({ searchParams }: { searchParams: { code?: string, error?: string } }) {
  const { code, error } = searchParams;

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      return redirect(`/forgot-password?error=${encodeURIComponent(exchangeError.message)}`);
    }
  }

  // The user is now authenticated and can reset their password.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
