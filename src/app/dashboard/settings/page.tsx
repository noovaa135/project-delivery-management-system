import { SettingsPage } from "@/components/settings-page";
import { requireSession } from "@/server/auth/session";

export default async function SettingsRoute() {
  const session = await requireSession();

  return (
    <SettingsPage
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        organizationName: null,
      }}
    />
  );
}
