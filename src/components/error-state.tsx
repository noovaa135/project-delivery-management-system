import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground/60">{description}</p>}
      {onRetry && (
        <Button variant="outline" className="mt-4 rounded-xl" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export { ErrorState };
