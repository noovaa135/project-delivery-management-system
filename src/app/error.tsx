"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/error-state";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4">
      <ErrorState title="Something went wrong" description="The application hit an unexpected error." />
      <Button className="mx-auto mt-6" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
