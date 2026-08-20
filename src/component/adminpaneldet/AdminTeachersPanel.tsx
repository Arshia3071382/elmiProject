// Admin teachers panel - Main component
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import TeacherHeader from "./teachers/TeacherHeader";
import TeacherForm from "./teachers/TeacherForm";
import TeacherList from "./teachers/TeacherList";
import {
  Teacher,
  TeacherFormData,
  Course,
  getInitialFormState,
} from "./teachers/constants";

export default function AdminTeachersPanel() {
  // State
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TeacherFormData>(
    getInitialFormState(),
  );
  const [courses, setCourses] = useState<Course[]>([]);
  
  // State for tracking editing mode
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch teachers
  const fetchTeachers = useCallback(async () => {
    try {
      const response = await fetch("/api/teachers", { cache: "no-store" });
      const result = await response.json();
      if (result.success) setTeachers(result.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  }, []);

  // Create or Update teacher
  const saveTeacher = useCallback(
    async (payload: any, id?: string) => {
      setIsLoading(true);
      try {
        const url = id ? `/api/teachers/${id}` : "/api/teachers";
        const method = id ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();

        if (result.success) {
          alert(id ? "✅ اطلاعات دبیر با موفقیت ویرایش شد!" : "✅ دبیر با موفقیت اضافه شد!");
          setFormData(getInitialFormState());
          setCourses([]);
          setEditingId(null);
          await fetchTeachers();
        } else {
          alert(`❌ خطا: ${result.error || "خطای نامشخص"}`);
        }
      } catch (error) {
        console.error("Error saving teacher:", error);
        alert("❌ خطا در ارتباط با سرور");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTeachers],
  );

  // Delete teacher
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
        alert(`❌ خطا: ${result.error || "خطای نامشخص"}`);
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("❌ خطا در ارتباط با سرور");
    }
  }, []);

  // Prepare form for editing an existing teacher
  const handleEditClick = useCallback((teacher: Teacher) => {
    setEditingId(teacher._id);
    setFormData({
      name: teacher.name || "",
      role: teacher.role || "",
      subject: teacher.subject || "",
      avatar: teacher.avatar || "",
      bio: teacher.bio || "",
      education: teacher.education || "",
      articlesCount: teacher.articlesCount || 0,
      experienceYears: teacher.experienceYears || 0,
      recentTopics: Array.isArray(teacher.recentTopics) ? teacher.recentTopics.join(", ") : "",
      email: teacher.email || "", // ایمیل اختیاری
      teachingSampleUrl: teacher.teachingSampleUrl || "",
    });

    setCourses(
      Array.isArray(teacher.courses) 
        ? teacher.courses.map(c => ({ title: c.title, url: c.url })) 
        : []
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Cancel editing mode
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setFormData(getInitialFormState());
    setCourses([]);
  }, []);

  // Form handlers
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

  // Submit
  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const cleanCourses = courses
        .filter((c) => c.title.trim() && c.url.trim())
        .map((c) => ({ title: c.title.trim(), url: c.url.trim() }));

      const recentTopics = (formData.recentTopics || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        email: formData.email?.trim() || "", // ارسال مقدار خالی در صورت عدم ورود ایمیل
        recentTopics,
        courses: cleanCourses,
      };

      await saveTeacher(payload, editingId || undefined);
    },
    [courses, formData, saveTeacher, editingId],
  );

  // Effects
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Derived state
  const teacherCount = useMemo(() => teachers.length, [teachers]);

  return (
    <div dir="rtl" className="space-y-10">
      <TeacherHeader />

      {/* بنر وضعیت ویرایش */}
      {editingId && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between text-amber-800 text-xs">
          <span>شما در حال ویرایش اطلاعات دبیر هستید.</span>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-colors font-bold"
          >
            لغو ویرایش
          </button>
        </div>
      )}

      <TeacherForm
        formData={formData}
        courses={courses}
        isLoading={isLoading}
        isEditing={!!editingId}
        onFormChange={handleFormChange}
        onCourseChange={handleCourseChange}
        onAddCourse={addCourse}
        onRemoveCourse={removeCourse}
        onSubmit={handleSubmit}
      />

      <TeacherList
        teachers={teachers}
        count={teacherCount}
        onDelete={deleteTeacher}
        onEdit={handleEditClick}
      />
    </div>
  );
}