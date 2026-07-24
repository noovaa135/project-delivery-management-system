import { redirect } from "next/navigation";

import { auth } from "@/server/auth/config";

export async function getCurrentSession() {
  return auth();
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session;
}
