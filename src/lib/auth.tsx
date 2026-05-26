import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { OfficeCode } from "./mock-data";

export const ROLES = [
  "Super Administrator",
  "Administrator",
  "Receiving Officer",
  "Office Scheduler",
  "RD Approver",
  "Viewer",
] as const;
export type Role = (typeof ROLES)[number];

export interface AppUser {
  id: string;
  name: string;
  position: string;
  office: OfficeCode;
  username: string;
  email: string;
  contact?: string;
  roles: Role[];
  status: "Active" | "Pending" | "Rejected" | "Locked";
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  category: "Auth" | "Document" | "Routing" | "Approval" | "Calendar" | "User" | "Settings" | "Security";
  details?: string;
}

interface AuthCtx {
  user: AppUser | null;
  users: AppUser[];
  audit: AuditEntry[];
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  registerRequest: (input: Omit<AppUser, "id" | "status" | "createdAt">) => void;
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
  toggleLock: (id: string) => void;
  hasRole: (...r: Role[]) => boolean;
  log: (e: Omit<AuditEntry, "id" | "at" | "actor"> & { actor?: string }) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const seedUsers: AppUser[] = [
  {
    id: "u-admin",
    name: "MIS Administrator",
    position: "MIS Head",
    office: "MIS",
    username: "admin",
    email: "admin@dost-caraga.gov.ph",
    roles: ["Super Administrator"],
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-rd",
    name: "Engr. Dominga A. Mallonga",
    position: "Regional Director",
    office: "ORD",
    username: "rd",
    email: "rd@dost-caraga.gov.ph",
    roles: ["RD Approver", "Viewer"],
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-receiver",
    name: "Maria S. Cabrera",
    position: "Records Officer",
    office: "ORD",
    username: "maria",
    email: "maria@dost-caraga.gov.ph",
    roles: ["Receiving Officer"],
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-sched",
    name: "Anna R. Velasco",
    position: "Admin Aide",
    office: "MIS",
    username: "anna",
    email: "anna@dost-caraga.gov.ph",
    roles: ["Office Scheduler", "Receiving Officer"],
    status: "Active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-pending",
    name: "Juan P. Dela Cruz",
    position: "Science Research Specialist II",
    office: "ADN",
    username: "jdelacruz",
    email: "juan@dost-caraga.gov.ph",
    roles: ["Receiving Officer"],
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
];

const seedAudit: AuditEntry[] = [
  {
    id: "a1",
    at: new Date(Date.now() - 3600_000).toISOString(),
    actor: "admin",
    action: "User account approved",
    category: "User",
    details: "Approved Maria S. Cabrera",
  },
  {
    id: "a2",
    at: new Date(Date.now() - 2 * 3600_000).toISOString(),
    actor: "system",
    action: "Scheduled backup completed",
    category: "Settings",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>(seedUsers);
  const [audit, setAudit] = useState<AuditEntry[]>(seedAudit);

  const value = useMemo<AuthCtx>(() => {
    const log: AuthCtx["log"] = (e) =>
      setAudit((prev) => [
        {
          id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          at: new Date().toISOString(),
          actor: e.actor ?? user?.username ?? "system",
          action: e.action,
          category: e.category,
          details: e.details,
        },
        ...prev,
      ]);

    return {
      user,
      users,
      audit,
      hasRole: (...r) => !!user && r.some((x) => user.roles.includes(x)),
      login: (username, password) => {
        const u = users.find((x) => x.username.toLowerCase() === username.toLowerCase());
        if (!u) return { ok: false, error: "Account not found." };
        if (u.status === "Pending") return { ok: false, error: "Account is awaiting administrator approval." };
        if (u.status === "Rejected") return { ok: false, error: "Account access has been denied." };
        if (u.status === "Locked") return { ok: false, error: "Account is locked. Contact your administrator." };
        // Mock: any non-empty password works; demo accepts "demo" or matching username
        if (!password) return { ok: false, error: "Password is required." };
        setUser(u);
        log({ actor: u.username, action: "User logged in", category: "Auth" });
        return { ok: true };
      },
      logout: () => {
        if (user) log({ action: "User logged out", category: "Auth" });
        setUser(null);
      },
      registerRequest: (input) => {
        const u: AppUser = {
          ...input,
          id: `u-${Date.now()}`,
          status: "Pending",
          createdAt: new Date().toISOString(),
        };
        setUsers((prev) => [u, ...prev]);
        log({ actor: input.username, action: "Registration submitted", category: "User", details: `${input.name} (${input.office})` });
      },
      approveUser: (id) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "Active" } : u)));
        const u = users.find((x) => x.id === id);
        if (u) log({ action: "User account approved", category: "User", details: u.name });
      },
      rejectUser: (id) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "Rejected" } : u)));
        const u = users.find((x) => x.id === id);
        if (u) log({ action: "User registration rejected", category: "User", details: u.name });
      },
      toggleLock: (id) => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: u.status === "Locked" ? "Active" : "Locked" } : u,
          ),
        );
      },
      log,
    };
  }, [user, users, audit]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
