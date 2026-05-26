import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { LogOut, X } from "lucide-react";
import logo from "@/assets/itrack-logo.png";

export const Route = createFileRoute("/logout")({
  head: () => ({ meta: [{ title: "Sign out — DOST Caraga iTRACK" }] }),
  component: LogoutPage,
});

function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  const confirm = () => {
    logout();
    router.invalidate();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
          <img src={logo} alt="iTRACK" width={44} height={44} className="object-contain" />
        </div>
        <h1 className="mt-4 font-display text-xl font-semibold">Sign out of iTRACK?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to log out? Any unsaved work will be lost.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-muted"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <button
            onClick={confirm}
            className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90"
          >
            <LogOut className="h-4 w-4" /> Confirm Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
