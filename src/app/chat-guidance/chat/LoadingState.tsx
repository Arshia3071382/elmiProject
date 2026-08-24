// Loading state component
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex h-[60vh] items-center justify-center font-['iranSans-r']">
      <Loader2 className="w-8 h-8 text-[var(--color-secondary)] animate-spin" />
    </div>
  );
}