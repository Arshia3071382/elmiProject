// Header component
import { UserCheck } from "lucide-react";

export default function TeacherHeader() {
  return (
    <div className="flex items-center gap-2">
      <UserCheck className="w-5 h-5 text-[var(--color-secondary)]" />
      <h2 className="text-lg font-['iranBold'] text-[var(--color-primary)]">
        مدیریت و افزودن اساتید
      </h2>
    </div>
  );
}