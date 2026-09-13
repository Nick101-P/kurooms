import { useState, useSyncExternalStore } from "react";
import { Lock, Mail, KeyRound, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ADMIN_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "admin123",
};

const STORAGE_KEY = "kurooms_admin_auth_v1";

let isAuth = false;
if (typeof window !== "undefined") {
  try {
    isAuth = localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    isAuth = false;
  }
}

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export const adminAuth = {
  getIsAuthenticated: () => isAuth,
  login: (emailInput: string, passInput: string): boolean => {
    if (
      emailInput.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
      passInput.trim() === ADMIN_CREDENTIALS.password
    ) {
      isAuth = true;
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch (err) {
        console.warn("Could not save admin session to localStorage", err);
      }
      notify();
      return true;
    }
    return false;
  },
  logout: () => {
    isAuth = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Could not remove admin session from localStorage", err);
    }
    notify();
  },
  subscribe: (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
};

export function useAdminAuth() {
  const isAuthenticated = useSyncExternalStore(
    adminAuth.subscribe,
    adminAuth.getIsAuthenticated,
    () => false,
  );

  return {
    isAuthenticated,
    login: adminAuth.login,
    logout: adminAuth.logout,
  };
}

export function AdminLoginForm({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const ok = login(email, password);
      setIsLoading(false);
      if (ok) {
        onLoginSuccess?.();
      } else {
        setError("Invalid email or password. Please verify credentials.");
      }
    }, 200);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-lift transition-all sm:p-10">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
              <Lock className="size-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <KeyRound className="size-3.5" />
              Restricted Access
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Admin Portal
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in with your administrative credentials to manage Kathmandu University listings.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive animate-in fade-in">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-sm font-medium">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full gap-2 text-base">
              {isLoading ? "Authenticating..." : "Sign In to Admin Panel"}
              {!isLoading && <ArrowRight className="size-4" />}
            </Button>
          </form>

          <div className="mt-6 border-t border-border/60 pt-5 text-center">
            <p className="text-xs text-muted-foreground">
              Authorized KU administration personnel only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
