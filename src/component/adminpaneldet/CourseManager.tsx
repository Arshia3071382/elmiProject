"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, X, CheckCircle, BookOpen, PlayCircle } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

interface Category {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
  category: Category;
  createdAt: string;
  updatedAt?: string;
  videoUrl?: string;
}

interface CourseManagerProps {
  courses: Course[];
  categories: Category[];
  onCourseUpdate: () => void;
  onShowMessage: (type: 'success' | 'error', text: string) => void;
}

export default function CourseManager({ 
  courses, 
  categories, 
  onCourseUpdate, 
  onShowMessage 
}: CourseManagerProps) {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  // استیت و رفرنس برای مدیریت ویدیوی تمام‌صفحه
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // گوش‌به‌زنگ سراسری مرورگر برای مدیریت خروج از حالت تمام‌صفحه (تایپ‌سیف و قطعی)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        if (videoRef.current) {
          videoRef.current.pause();
        }
        setActiveVideoUrl(""); // ریست کردن آدرس ویدیو برای آزاد شدن پپ‌لود سیستم
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // تابع اجرای ویدیو در حالت تمام‌صفحه
  const handlePlayFullscreen = async (videoUrl: string) => {
    if (!videoUrl) {
      onShowMessage('error', 'فایل ویدیویی برای این دوره یافت نشد');
      return;
    }

    setActiveVideoUrl(videoUrl);

    // یک وقفه بسیار کوتاه برای بازنشانی سورس جدید در DOM ویدیو
    setTimeout(async () => {
      const video = videoRef.current;
      if (!video) return;

      try {
        if (video.requestFullscreen) {
          await video.requestFullscreen();
        } else if ((video as any).webkitRequestFullscreen) {
          await (video as any).webkitRequestFullscreen(); // Safari / iOS
        } else if ((video as any).msRequestFullscreen) {
          await (video as any).msRequestFullscreen(); // IE / Edge
        }
        
        // پخش خودکار بعد از ماکسیمایز شدن طول و عرض صفحه
        await video.play();
      } catch (error) {
        console.error("خطا در اجرای تمام‌صفحه:", error);
        video.play();
      }
    }, 50);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses?id=${deleteModal.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      
      if (data.success) {
        onShowMessage('success', `دوره "${deleteModal.name}" با موفقیت حذف شد`);
        onCourseUpdate();
      } else {
        onShowMessage('error', data.error || "خطا در حذف دوره");
      }
    } catch (error) {
      onShowMessage('error', "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
      setDeleteModal({ isOpen: false, id: "", name: "" });
    }
  };

  const handleUpdate = async () => {
    if (!editName.trim()) {
      onShowMessage('error', 'نام دوره نمی‌تواند خالی باشد');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCourse?._id,
          name: editName,
          categoryId: editCategoryId,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        onShowMessage('success', `دوره "${editName}" با موفقیت ویرایش شد`);
        setEditingCourse(null);
        onCourseUpdate();
      } else {
        onShowMessage('error', data.error || "خطا در ویرایش دوره");
      }
    } catch (error) {
      onShowMessage('error', "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (course: Course) => {
    setEditingCourse(course);
    setEditName(course.name);
    
    if (course.category && typeof course.category === 'object') {
      setEditCategoryId(course.category._id || "");
    } else {
      setEditCategoryId((course.category as unknown as string) || "");
    }
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    setEditName("");
    setEditCategoryId("");
  };

  return (
    <>
      {/* تگ ویدیوی پنهان و ایمن از خطای تایپ‌اسکریپت */}
      <video
        ref={videoRef}
        src={activeVideoUrl}
        className="hidden"
        controls
      />

      <div className="space-y-3">
        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          لیست دوره‌ها
        </h3>
        
        {courses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">هیچ دوره‌ای وجود ندارد</div>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition border border-gray-100">
              {editingCourse?._id === course._id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button onClick={handleUpdate} disabled={loading} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" /> ذخیره
                    </button>
                    <button onClick={cancelEdit} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 flex items-center justify-center gap-2">
                      <X className="w-4 h-4" /> انصراف
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* دکمه اختصاصی پخش مستقیم و تمام‌صفحه */}
                    <button
                      onClick={() => handlePlayFullscreen(course.videoUrl || "")}
                      className="p-1 text-blue-600 hover:text-blue-700 hover:scale-110 transition duration-200"
                      title="پخش تمام‌صفحه دوره"
                    >
                      <PlayCircle className="w-9 h-9 fill-blue-50" />
                    </button>
                    
                    <div>
                      <h4 className="font-bold text-gray-800">{course.name}</h4>
                      <p className="text-sm text-gray-500">
                        گروه: {course.category && typeof course.category === 'object' ? (course.category.name || "بدون گروه") : "بدون گروه"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {course.updatedAt 
                          ? `آخرین ویرایش: ${new Date(course.updatedAt).toLocaleDateString("fa-IR")}`
                          : `ایجاد: ${new Date(course.createdAt).toLocaleDateString("fa-IR")}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(course)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="ویرایش">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => setDeleteModal({ isOpen: true, id: course._id, name: course.name })} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="حذف">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="حذف دوره"
        message={`آیا از حذف دوره "${deleteModal.name}" مطمئن هستید؟`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: "", name: "" })}
        loading={loading}
      />
    </>
  );
}