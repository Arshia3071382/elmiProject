// src/component/league/SectionTitle.tsx
import { Sparkles } from "lucide-react";

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 text-center">
      {eyebrow && (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
          <Sparkles size={16} />
          {eyebrow}
        </div>
      )}

      <h2 className="font-[iranBold] text-2xl text-slate-900 md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-500 md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}