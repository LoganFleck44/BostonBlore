"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type EngagementStatus = "pending" | "active" | "inactive";

export function ClientPaymentToggle({
  clientId,
  clientName,
  hasPaid,
  engagementStatus,
  compact = false,
}: {
  clientId: string;
  clientName: string;
  hasPaid: boolean;
  engagementStatus: EngagementStatus;
  compact?: boolean;
}) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  async function update(action: "mark_paid" | "mark_unpaid" | "set_inactive" | "set_active") {
    setLoadingAction(action);
    const response = await fetch("/api/coach/client-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, action }),
    });
    setLoadingAction(null);
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      window.alert(data?.error || "Could not update client status.");
      return;
    }
    router.refresh();
  }

  async function removeClient() {
    const confirmed = window.confirm(
      `Delete ${clientName} from the database? This removes their application, plans, messages, check-ins, and progress history.`,
    );
    if (!confirmed) return;

    setLoadingAction("delete");
    const response = await fetch(`/api/coach/client-status?clientId=${encodeURIComponent(clientId)}`, {
      method: "DELETE",
    });
    setLoadingAction(null);
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      window.alert(data?.error || "Could not delete this client.");
      return;
    }
    router.push("/coach/clients");
    router.refresh();
  }

  const mainAction =
    engagementStatus === "pending"
      ? {
          label: "Mark paid",
          action: "mark_paid" as const,
          variant: "primary" as const,
        }
      : engagementStatus === "active"
        ? {
            label: "Move inactive",
            action: "set_inactive" as const,
            variant: "outline" as const,
          }
        : {
            label: "Reactivate",
            action: "set_active" as const,
            variant: "primary" as const,
          };

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "justify-start" : ""}`}>
      <Button
        type="button"
        variant={mainAction.variant}
        size="md"
        disabled={loadingAction !== null}
        onClick={() => update(mainAction.action)}
      >
        {loadingAction === mainAction.action ? "Saving..." : mainAction.label}
      </Button>
      {hasPaid && engagementStatus !== "pending" && (
        <Button
          type="button"
          variant="ghost"
          size="md"
          disabled={loadingAction !== null}
          onClick={() => update("mark_unpaid")}
          className="text-gold hover:text-gold"
        >
          {loadingAction === "mark_unpaid" ? "Saving..." : "Set pending"}
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="md"
        disabled={loadingAction !== null}
        onClick={removeClient}
        className="text-ember hover:text-ember"
      >
        {loadingAction === "delete" ? "Deleting..." : compact ? "Delete" : "Delete from DB"}
      </Button>
    </div>
  );
}
