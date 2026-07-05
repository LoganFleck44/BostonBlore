"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function ClientPaymentToggle({
  clientId,
  hasPaid,
}: {
  clientId: string;
  hasPaid: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const response = await fetch("/api/coach/client-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, hasPaid: !hasPaid }),
    });

    setLoading(false);
    if (!response.ok) {
      return;
    }

    router.refresh();
  }

  return (
    <Button
      type="button"
      variant={hasPaid ? "outline" : "primary"}
      size="md"
      disabled={loading}
      onClick={toggle}
    >
      {loading ? "Saving..." : hasPaid ? "Mark unpaid" : "Mark paid"}
    </Button>
  );
}
