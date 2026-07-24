import Link from "next/link";

import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4">
      <ErrorState
        title="Unauthorized"
        description="You do not have permission to access this area. Contact a system administrator if you need access."
      />
      <Button className="mx-auto mt-6" asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </main>
  );
}
