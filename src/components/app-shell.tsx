import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  CheckSquare,
  BarChart3,
  Bell,
  Search,
  Plus,
  ShieldCheck,
  Users,
  ScrollText,
  LogOut,
} from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useAuth, type Role } from "@/lib/auth";
import logo from "@/assets/itrack-logo.png";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: Role[]; // if set, restrict
}

const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/calendar", label: "Regional Calendar", icon: CalendarDays },
  { to: "/approvals", label: "RD Approvals", icon: CheckSquare, roles: ["RD Approver", "Administrator", "Super Administrator"] },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/users", label: "User Management", icon: Users, roles: ["Administrator", "Super Administrator"] },
  { to: "/audit", label: "Audit Logs", icon: ScrollText, roles: ["Super Administrator"] },
];

export function AppShell({ children, title, action }: { children: ReactNode; title: string; action?: ReactNode }) {
  const { location } = useRouterState();
  const { events, documents } = useStore();
  const { user, hasRole, logout } = useAuth();
  const pendingRD = events.filter((e) => e.status === "Pending RD Approval").length;
  const pendingDocs = documents.filter((d) => d.status === "Pending" || d.status === "For Approval").length;

  const visibleNav = NAV.filter((n) => !n.roles || hasRole(...n.roles));

  const initials =
    user?.name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() ?? "??";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-5 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0">
              <img src={logo} alt="iTRACK" width={40} height={40} className="object-contain" />
            </div>
            <div className="min-w-0">
              <div className="font-display font-semibold text-sm leading-tight">DOST Caraga</div>
              <div className="text-xs text-sidebar-foreground/70 tracking-wide">iTRACK</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleNav.map((n) => {
            const active = n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to);
            const badge =
              n.to === "/approvals" ? pendingRD : n.to === "/documents" ? pendingDocs : 0;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <n.icon className="h-4 w-4" />
                <span className="flex-1">{n.label}</span>
                {badge > 0 && (
                  <span className="rounded-full bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-0.5">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure session · iTRACK v1.0
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-background/85 backdrop-blur border-b border-border">
          <div className="flex items-center gap-4 px-6 py-3">
            <div className="min-w-0">
              <h1 className="text-xl font-display font-semibold text-foreground truncate">{title}</h1>
            </div>
            <div className="flex-1 max-w-md hidden md:flex items-center gap-2 rounded-md border border-input bg-card px-3 py-1.5 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search documents, events, tracking #…"
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              {action}
              <button className="relative p-2 rounded-md hover:bg-muted" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                {(pendingRD + pendingDocs) > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
                )}
              </button>
              <div className="hidden sm:flex flex-col items-end text-right leading-tight">
                <span className="text-xs font-medium truncate max-w-[160px]">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                  {user?.roles[0]}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                {initials}
              </div>
              <Link
                to="/logout"
                className="p-2 rounded-md hover:bg-muted text-muted-foreground"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  icon: Icon = Plus,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  icon?: typeof Plus;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground shadow-sm hover:bg-accent/90 transition-colors"
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}
