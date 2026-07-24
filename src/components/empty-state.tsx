import { Inbox } from "lucide-react";

function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const Comp = Icon ?? Inbox;
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/30 ring-1 ring-border/30">
        <Comp className="h-6 w-6 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground/60">{description}</p>}
    </div>
  );
}

export { EmptyState };
