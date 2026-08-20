// Teacher item component
import { Trash2, ExternalLink, Edit } from "lucide-react";
import { Teacher } from "./constants";

interface TeacherItemProps {
  teacher: Teacher;
  onDelete: (id: string) => void;
  onEdit: (teacher: Teacher) => void; // اضافه شد
}

export default function TeacherItem({ teacher, onDelete, onEdit }: TeacherItemProps) {
  const avatarSrc = teacher.avatar || "/default-avatar.png";

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={avatarSrc}
          alt={teacher.name}
          className="w-10 h-10 rounded-full object-cover shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-avatar.png";
          }}
        />

        <div className="min-w-0">
          <h4 className="text-xs font-['iranBold'] text-[var(--color-primary)] truncate">
            {teacher.name}
          </h4>
          <p className="text-[10px] text-[var(--color-text-secondary)] truncate">
            {teacher.subject}
            {teacher.role ? ` - ${teacher.role}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {teacher.teachingSampleUrl && (
          <a
            href={teacher.teachingSampleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
            title="مشاهده نمونه تدریس"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {/* دکمه ویرایش */}
        <button
          type="button"
          onClick={() => onEdit(teacher)}
          className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
          title="ویرایش استاد"
        >
          <Edit className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(teacher._id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          title="حذف استاد"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}