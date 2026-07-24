import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/server/auth/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return <AppShell user={session.user}>{children}</AppShell>;
}
