"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Minus, Plus } from "lucide-react";

interface QuantityControlsProps {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  isPending: boolean;
}

export default function QuantityControls({
  quantity,
  onAdd,
  onRemove,
  isPending
}: QuantityControlsProps) {
  return (
    <div className="flex-center mt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onRemove}
        disabled={isPending}
      >
        {isPending ? <Spinner /> : <Minus />}
      </Button>
      <span className="px-3">{quantity}</span>
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        disabled={isPending}
      >
        {isPending ? <Spinner /> : <Plus />}
      </Button>
    </div>
  );
}
