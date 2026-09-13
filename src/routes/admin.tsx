import { createFileRoute } from "@tanstack/react-router";
import { AdminLoginForm, useAdminAuth } from "@/components/admin/AdminAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — BasaiKU" },
      {
        name: "description",
        content:
          "Manage student rooms, furniture listings, and reported content for Kathmandu University.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAuthenticated, logout } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLoginForm onLoginSuccess={() => {}} />;
  }

  return <AdminDashboard onLogout={logout} />;
}
