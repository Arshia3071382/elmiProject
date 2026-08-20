// Course fields component
import { Plus, Trash2 } from "lucide-react";
import { Course } from "./constants";

interface TeacherCourseFieldsProps {
  courses: Course[];
  onAddCourse: () => void;
  onRemoveCourse: (index: number) => void;
  onCourseChange: (index: number, field: keyof Course, value: string) => void;
}

export default function TeacherCourseFields({
  courses,
  onAddCourse,
  onRemoveCourse,
  onCourseChange,
}: TeacherCourseFieldsProps) {
  return (
    <div className="md:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <div>
          <label className="block text-xs font-['iranBold'] text-[var(--color-primary)]">
            دوره‌های ارائه‌شده
          </label>
          <p className="text-[9px] text-[var(--color-text-secondary)] mt-1">
            برای هر دوره نام و لینک مشاهده را وارد کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddCourse}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-[var(--color-secondary)] border border-blue-100 text-xs font-['iranBold'] hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          افزودن دوره
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-dashed border-[var(--color-border)] text-center text-xs text-[var(--color-text-secondary)]">
          هنوز دوره‌ای اضافه نشده است.
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-['iranBold'] text-[var(--color-primary)]">
                  دوره {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveCourse(index)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="حذف دوره"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={course.title}
                  onChange={(e) =>
                    onCourseChange(index, "title", e.target.value)
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--color-border)] text-xs bg-white focus:outline-none"
                  placeholder="نام دوره"
                />
                <input
                  type="url"
                  value={course.url}
                  onChange={(e) =>
                    onCourseChange(index, "url", e.target.value)
                  }
                  className="w-full p-2.5 rounded-xl border border-[var(--color-border)] text-xs bg-white focus:outline-none"
                  placeholder="https://example.com/course"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}