// Teacher form component
import { Plus } from "lucide-react";
import FormInput from "./TeacherFormInput";
import TeacherCourseFields from "./TeacherCourseFields";
import { TeacherFormData, Course } from "./constants";

interface TeacherFormProps {
  formData: TeacherFormData;
  courses: Course[];
  isLoading: boolean;
  isEditing?: boolean; // <--- اضافه شد
  onFormChange: <K extends keyof TeacherFormData>(
    field: K,
    value: TeacherFormData[K]
  ) => void;
  onCourseChange: (index: number, field: keyof Course, value: string) => void;
  onAddCourse: () => void;
  onRemoveCourse: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TeacherForm({
  formData,
  courses,
  isLoading,
  isEditing = false, // <--- اضافه شد (با مقدار پیش‌فرض false)
  onFormChange,
  onCourseChange,
  onAddCourse,
  onRemoveCourse,
  onSubmit,
}: TeacherFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8 border-b border-[var(--color-border)]"
    >
      {/* Basic info */}
      <FormInput
        label="نام کامل استاد"
        required
        value={formData.name}
        onChange={(val) => onFormChange("name", val)}
        placeholder="مثال: دکتر علی رضایی"
      />

      <FormInput
        label="عنوان / سمت"
        required
        value={formData.role}
        onChange={(val) => onFormChange("role", val)}
        placeholder="مثال: مدرس ارشد فیزیک"
      />

      <FormInput
        label="حوزه تدریس / درس"
        required
        value={formData.subject}
        onChange={(val) => onFormChange("subject", val)}
        placeholder="مثال: فیزیک"
      />

      <FormInput
        label="مدرک / رشته تحصیلی"
        value={formData.education}
        onChange={(val) => onFormChange("education", val)}
        placeholder="مثال: کارشناسی مهندسی کامپیوتر"
      />

      <FormInput
        label="لینک پابلیک عکس"
        type="url"
        required
        value={formData.avatar}
        onChange={(val) => onFormChange("avatar", val)}
        placeholder="https://example.com/image.jpg"
      />

      <FormInput
        label="ایمیل ارتباطی (اختیاری)"
        type="email"
        value={formData.email}
        onChange={(val) => onFormChange("email", val)}
        placeholder="teacher@example.com"
      />

      {/* Number inputs */}
      <div className="grid grid-cols-2 gap-2">
        <FormInput
          label="تعداد مقالات"
          type="number"
          min={0}
          value={String(formData.articlesCount)}
          onChange={(val) => onFormChange("articlesCount", Number(val))}
        />
        <FormInput
          label="سال سابقه"
          type="number"
          min={0}
          value={String(formData.experienceYears)}
          onChange={(val) => onFormChange("experienceYears", Number(val))}
        />
      </div>

      <FormInput
        label="لینک نمونه تدریس"
        type="url"
        value={formData.teachingSampleUrl}
        onChange={(val) => onFormChange("teachingSampleUrl", val)}
        placeholder="https://..."
        helper="لینک ویدیو در آپارات، یوتیوب یا هر صفحه دیگری"
      />

      <FormInput
        label="حوزه‌های تخصصی"
        value={formData.recentTopics}
        onChange={(val) => onFormChange("recentTopics", val)}
        placeholder="هوش مصنوعی, الگوریتم, پایتون"
        helper="موارد را با کاما جدا کنید."
      />

      {/* Bio */}
      <div className="md:col-span-2">
        <label className="block text-xs font-['iranBold'] text-[var(--color-primary)] mb-1">
          بیوگرافی و توضیحات
        </label>
        <textarea
          rows={3}
          value={formData.bio}
          onChange={(e) => onFormChange("bio", e.target.value)}
          className="w-full p-2.5 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] focus:outline-none resize-none"
          placeholder="توضیحات کوتاه درباره استاد..."
        />
      </div>

      {/* Courses */}
      <TeacherCourseFields
        courses={courses}
        onAddCourse={onAddCourse}
        onRemoveCourse={onRemoveCourse}
        onCourseChange={onCourseChange}
      />

      {/* Submit */}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-[var(--color-secondary)] text-white font-['iranBold'] text-xs hover:bg-[var(--color-primary)] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>
            {isLoading
              ? "در حال ذخیره‌سازی..."
              : isEditing
              ? "بروزرسانی اطلاعات استاد"
              : "ثبت و افزودن استاد جدید"}
          </span>
        </button>
      </div>
    </form>
  );
}