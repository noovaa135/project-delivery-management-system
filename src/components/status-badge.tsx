import { Badge } from "@/components/ui/badge";

type DeliveryHealth = "on-track" | "at-risk" | "blocked";

const healthConfig: Record<DeliveryHealth, { label: string; variant: "success" | "warning" | "destructive" }> = {
  "on-track": { label: "On Track", variant: "success" },
  "at-risk": { label: "At Risk", variant: "warning" },
  blocked: { label: "Blocked", variant: "destructive" },
};

function StatusBadge({ health }: { health: DeliveryHealth }) {
  const config = healthConfig[health] ?? healthConfig["on-track"];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export { StatusBadge };
export type { DeliveryHealth };
