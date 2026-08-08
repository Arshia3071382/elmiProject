"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Trash2, UserCheck, ExternalLink } from "lucide-react";

// ============================================================
//  TYPES
// ============================================================
interface Course {
  title: string;
  url: string;
}

interface Teacher {
  _id: string;
  name: string;
  role: string;
  subject: string;
  avatar: string;
  bio: string;
  education: string;
  articlesCount: number;
  experienceYears: number;
  recentTopics: string[];
  teachingSampleUrl: string;
  courses: Course[];
  email: string;
}

interface TeacherFormData {
  name: string;
  role: string;
  subject: string;
  avatar: string;
  bio: string;
  education: string;
  articlesCount: number;
  experienceYears: number;
  recentTopics: string;
  teachingSampleUrl: string;
  email: string;
}

// ============================================================
//  COMPONENT
// ============================================================
export default function AdminTeachersPanel() {
  // ---------- STATE ----------
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TeacherFormData>(initialFormState());
  const [courses, setCourses] = useState<Course[]>([]);

  // ---------- HELPERS ----------
  function initialFormState(): TeacherFormData {
    return {
      name: "",
      role: "",
      subject: "",
      avatar: "",
      bio: "",
      education: "",
      articlesCount: 0,
      experienceYears: 0,
      recentTopics: "",
      teachingSampleUrl: "",
      email: "",
    };
  }

  // ---------- API CALLS ----------
  const fetchTeachers = useCallback(async () => {
    try {
      const response = await fetch("/api/teachers", { cache: "no-store" });
      const result = await response.json();

      if (result.success) {
        setTeachers(result.data);
      } else {
        console.warn("Failed to fetch teachers:", result.error);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  }, []);

  const createTeacher = useCallback(
    async (payload: Omit<Teacher, "_id">) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.success) {
          alert("✅ دبیر با موفقیت اضافه شد!");
          resetForm();
          await fetchTeachers();
        } else {
          alert(`❌ خطا در ثبت اطلاعات: ${result.error || "خطای نامشخص"}`);
        }
      } catch (error) {
        console.error("Error creating teacher:", error);
        alert("❌ خطا در ارتباط با سرور");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTeachers],
  );

  const deleteTeacher = useCallback(async (id: string) => {
    if (!id) return alert("شناسه استاد نامعتبر است");
    if (!confirm("آیا از حذف این استاد اطمینان دارید؟")) return;

    try {
      const response = await fetch(`/api/teachers/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (result.success) {
        setTeachers((prev) => prev.filter((t) => t._id !== id));
        alert("✅ استاد با موفقیت حذف شد");
      } else {
        alert(`❌ خطا در حذف استاد: ${result.error || "خطای نامشخص"}`);
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("❌ خطا در ارتباط با سرور");
    }
  }, []);

  // ---------- FORM HANDLERS ----------
  const resetForm = useCallback(() => {
    setFormData(initialFormState());
    setCourses([]);
  }, []);

  const handleFormChange = useCallback(
    <K extends keyof TeacherFormData>(field: K, value: TeacherFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleCourseChange = useCallback(
    (index: number, field: keyof Course, value: string) => {
      setCourses((prev) =>
        prev.map((course, i) =>
          i === index ? { ...course, [field]: value } : course,
        ),
      );
    },
    [],
  );

  const addCourse = useCallback(() => {
    setCourses((prev) => [...prev, { title: "", url: "" }]);
  }, []);

  const removeCourse = useCallback((index: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ---------- SUBMIT ----------
  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const cleanCourses = courses
        .filter((c) => c.title.trim() && c.url.trim())
        .map((c) => ({
          title: c.title.trim(),
          url: c.url.trim(),
        }));

      const topics = formData.recentTopics
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        recentTopics: topics,
        courses: cleanCourses,
      };

      await createTeacher(payload);
    },
    [courses, formData, createTeacher],
  );

  // ---------- EFFECTS ----------
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // ---------- DERIVED STATE ----------
  const teacherCount = useMemo(() => teachers.length, [teachers]);

  // ============================================================
  //  RENDER
  // ============================================================
  return (
    <div dir="rtl" className="space-y-10">
      {/* HEADER */}
      <Header />

      {/* FORM */}
      <TeacherForm
        formData={formData}
        courses={courses}
        isLoading={isLoading}
        onFormChange={handleFormChange}
        onCourseChange={handleCourseChange}
        onAddCourse={addCourse}
        onRemoveCourse={removeCourse}
        onSubmit={handleSubmit}
      />

      {/* LIST */}
      <TeacherList
        teachers={teachers}
        count={teacherCount}
        onDelete={deleteTeacher}
      />
    </div>
  );
}

// ============================================================
//  SUBCOMPONENTS
// ============================================================

function Header() {
  return (
    <div className="flex items-center gap-2">
      <UserCheck className="w-5 h-5 text-[var(--color-secondary)]" />
      <h2 className="text-lg font-['iranBold'] text-[var(--color-primary)]">
        مدیریت و افزودن اساتید
      </h2>
    </div>
  );
}

// ---------- FORM ----------
interface TeacherFormProps {
  formData: TeacherFormData;
  courses: Course[];
  isLoading: boolean;
  onFormChange: <K extends keyof TeacherFormData>(
    field: K,
    value: TeacherFormData[K],
  ) => void;
  onCourseChange: (index: number, field: keyof Course, value: string) => void;
  onAddCourse: () => void;
  onRemoveCourse: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function TeacherForm({
  formData,
  courses,
  isLoading,
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
      {/* Input fields */}
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
        label="ایمیل ارتباطی"
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

      {/* Submit */}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-[var(--color-secondary)] text-white font-['iranBold'] text-xs hover:bg-[var(--color-primary)] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>
            {isLoading ? "در حال ذخیره‌سازی..." : "ثبت و افزودن استاد جدید"}
          </span>
        </button>
      </div>
    </form>
  );
}

// ---------- FORM INPUT ----------
interface FormInputProps {
  label: string;
  type?: "text" | "url" | "email" | "number";
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  min?: number;
}

function FormInput({
  label,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
  helper,
  min,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-xs font-['iranBold'] text-[var(--color-primary)] mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] focus:outline-none"
        placeholder={placeholder}
      />
      {helper && (
        <p className="text-[9px] text-[var(--color-text-secondary)] mt-1">
          {helper}
        </p>
      )}
    </div>
  );
}

// ---------- TEACHER LIST ----------
interface TeacherListProps {
  teachers: Teacher[];
  count: number;
  onDelete: (id: string) => void;
}

function TeacherList({ teachers, count, onDelete }: TeacherListProps) {
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
          />
        ))}
      </div>
    </div>
  );
}

// ---------- TEACHER ITEM ----------
interface TeacherItemProps {
  teacher: Teacher;
  onDelete: (id: string) => void;
}

function TeacherItem({ teacher, onDelete }: TeacherItemProps) {
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
