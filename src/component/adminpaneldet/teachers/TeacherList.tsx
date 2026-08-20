// Teacher list component
import TeacherItem from "./TeacherItem";
import { Teacher } from "./constants";

interface TeacherListProps {
  teachers: Teacher[];
  count: number;
  onDelete: (id: string) => void;
  onEdit: (teacher: Teacher) => void; // اضافه شد
}

export default function TeacherList({ teachers, count, onDelete, onEdit }: TeacherListProps) {
  if (teachers.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] text-center text-xs text-[var(--color-text-secondary)]">
        هنوز استادی ثبت نشده است.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-['iranBold'] text-[var(--color-primary)] mb-4">
        لیست اساتید ثبت‌شده ({count})
      </h3>

      <div className="space-y-3">
        {teachers.map((teacher) => (
          <TeacherItem
            key={teacher._id}
            teacher={teacher}
            onDelete={onDelete}
            onEdit={onEdit} // پاس دادن به کامپوننت آیتم
          />
        ))}
      </div>
    </div>
  );
}