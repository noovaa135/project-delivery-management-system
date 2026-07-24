import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4">
      <EmptyState title="Page not found" description="The page you requested does not exist." />
      <Button className="mx-auto mt-6" asChild>
        <Link href="/">Go home</Link>
      </Button>
    </main>
  );
}
