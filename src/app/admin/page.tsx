"use client";

import { useState, useEffect, useCallback } from "react";
import { LogOut } from "lucide-react";
import StatsCards from "./../../component/adminpaneldet/StatsCards";
import AddCourseForm from "./../../component/adminpaneldet/AddCourseForm";
import CourseManager from "./../../component/adminpaneldet/CourseManager";
import CategoryManager from "./../../component/adminpaneldet/CategoryManager";
import AdminSidebar from "./../../component/adminpaneldet/AdminSidebar";
import AdminLoginModal from "./../../component/adminpaneldet/AdminLoginModal";
import AddCategoryModal from "./../../component/adminpaneldet/AddCategoryModal";

export default function AdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState<"courses" | "categories">("courses");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories").then(r => r.json()).catch(() => showMessage("error", "خطا در دریافت گروه‌ها"));
    if (res?.success) {
      setCategories(res.categories);
      if (res.categories.length > 0 && !selectedCategory) setSelectedCategory(res.categories[0]._id);
    }
  }, [selectedCategory, showMessage]);

  const fetchCourses = useCallback(async () => {
    const res = await fetch("/api/courses").then(r => r.json()).catch(() => showMessage("error", "خطا در دریافت دوره‌ها"));
    if (res?.success) setCourses(res.courses);
  }, [showMessage]);

  const fetchContactMessages = useCallback(async () => {
    const res = await fetch("/api/contacts").then(r => r.json()).catch(console.error);
    if (res?.success) setContactMessages(res.messages);
  }, []);

  useEffect(() => {
    fetch("/api/check-auth").then(r => r.json()).then(data => {
      if (data?.isLoggedIn) {
        setIsLoggedIn(true);
        fetchCategories(); fetchCourses(); fetchContactMessages();
      }
    }).catch(console.error).finally(() => setIsCheckingAuth(false));
  }, [fetchCategories, fetchCourses, fetchContactMessages]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return showMessage("error", "لطفاً نام گروه را وارد کنید");
    const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCategoryName.trim() }) }).then(r => r.json()).catch(() => showMessage("error", "خطا در ارتباط با سرور"));
    if (res?.success) {
      showMessage("success", `گروه "${newCategoryName}" با موفقیت اضافه شد`);
      setCategories(prev => [res.category, ...prev]);
      setSelectedCategory(res.category._id);
      setShowCategoryModal(false);
      setNewCategoryName("");
    }
  };

  const handleAddCourse = async (formData: FormData) => {
    if (!selectedCategory) return showMessage("error", "لطفاً یک گروه انتخاب کنید"), false;
    formData.set("categoryId", selectedCategory);
    const res = await fetch("/api/courses", { method: "POST", body: formData }).then(r => r.json()).catch(() => showMessage("error", "خطا در ارتباط با سرور"));
    if (res?.success) return showMessage("success", `دوره با موفقیت اضافه شد`), fetchCourses(), true;
    return false;
  };

  const handleLogout = async () => {
    await fetch("/api/admin-logout", { method: "POST" }).then(() => { setIsLoggedIn(false); }).catch(() => showMessage("error", "خطا در خروج از پنل"));
  };

  if (isCheckingAuth) return <div className="min-h-screen bg-white"></div>;
  if (!isLoggedIn) return <AdminLoginModal onLoginSuccess={() => window.location.reload()} />;

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-12 pb-12 shadow-sm px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black mb-2">پنل مدیریت دوره‌ها</h1>
            <p className="text-blue-100">مدیریت مستقیم گروه‌ها و دوره‌های آموزشی علمی منتظران</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-lg">
            <LogOut className="w-5 h-5" /> خروج از پنل
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex border-b border-gray-200">
            <button onClick={() => setActiveTab("courses")} className={`px-6 py-4 font-bold text-base ${activeTab === "courses" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}>مدیریت دوره‌ها</button>
            <button onClick={() => setActiveTab("categories")} className={`px-6 py-4 font-bold text-base ${activeTab === "categories" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}>مدیریت گروه‌ها</button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            {activeTab === "courses" ? (
              <><AddCourseForm categories={categories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} onAddCourse={handleAddCourse} coursesCount={id => courses.filter(c => c.category?._id === id).length} /><CourseManager courses={courses} categories={categories} onCourseUpdate={fetchCourses} onShowMessage={showMessage} /></>
            ) : (
              <CategoryManager categories={categories} coursesCount={id => courses.filter(c => c.category?._id === id).length} onCategoryUpdate={() => { fetchCategories(); fetchCourses(); }} onShowMessage={showMessage} onOpenAddModal={() => setShowCategoryModal(true)} />
            )}
          </div>
        </div>
        <div className="space-y-6">
          <StatsCards categoriesCount={categories.length} coursesCount={courses.length} averageCourses={categories.length ? Number((courses.length / categories.length).toFixed(1)) : 0} />
          <AdminSidebar courses={courses} contactMessages={contactMessages} />
        </div>
      </div>

      {/* Notices Form Section Added at the bottom */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <AdminNoticePanel onShowMessage={showMessage} />
      </div>

      {message && <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg z-50 text-white font-bold text-sm ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}>{message.text}</div>}
      <AddCategoryModal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} onSubmit={handleAddCategory} name={newCategoryName} onNameChange={setNewCategoryName} />
    </div>
  );
}

// Notice management sub-component
function AdminNoticePanel({ onShowMessage }: { onShowMessage: (type: "success" | "error", text: string) => void }) {
  const [type, setType] = useState("schedule");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [instructor, setInstructor] = useState("");
  const [startTime, setStartTime] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const instructors = ["آقای مختاری", "آقای داوودآبادی", "آقای فرهادی"];
    const randomInstructor = instructors[Math.floor(Math.random() * instructors.length)];

    const payload = {
      type,
      title,
      location: type !== "news" ? location || "واحد علمی مرکزی" : undefined,
      instructor: type !== "news" ? instructor || randomInstructor : undefined,
      startTime: type === "schedule" ? startTime : undefined,
      content: type === "news" ? content : undefined,
    };

    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(r => r.json());

      if (res?.success) {
        onShowMessage("success", "اطلاعیه با موفقیت ثبت شد و کنترل سقف تعداد انجام پذیرفت.");
        setTitle(""); setLocation(""); setInstructor(""); setStartTime(""); setContent("");
      } else {
        onShowMessage("error", "خطا در ذخیره‌سازی اطلاعیه");
      }
    } catch {
      onShowMessage("error", "خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">ایجاد اخبار و اطلاعیه جدید</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-700">
        <div>
          <label className="block text-gray-600 mb-1 font-medium">نوع اطلاعیه:</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500">
            <option value="schedule">برگزاری کلاس (تیک سبز)</option>
            <option value="cancel">کنسلی کلاس (ضربدر قرمز)</option>
            <option value="news">خبر عمومی و متنی آزمون‌ها</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-600 mb-1 font-medium">
            {type === "news" ? "عنوان خبر / موضوع آزمون:" : "نام کلاس علمی:"}
          </label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        {type !== "news" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1 font-medium">مکان برگزاری / واحد علمی:</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-blue-500" placeholder="مثال: کلاس ۱۰۲ واحد مرکزی" />
            </div>
            <div>
              <label className="block text-gray-600 mb-1 font-medium">نام استاد (خالی بماند رندوم انتخاب می‌شود):</label>
              <input type="text" value={instructor} onChange={(e) => setInstructor(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-blue-500" placeholder="مثال: آقای مختاری" />
            </div>
          </div>
        )}

        {type === "schedule" && (
          <div>
            <label className="block text-gray-600 mb-1 font-medium">زمان دقیق شروع کلاس پس‌فردا یا زمان مدنظر:</label>
            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
        )}

        {type === "news" && (
          <div>
            <label className="block text-gray-600 mb-1 font-medium">متن کوتاه خبری:</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required className="w-full border border-gray-200 p-2.5 rounded-lg h-24 focus:outline-none focus:border-blue-500" />
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold transition shadow-sm">
          ثبت و انتشار در صفحه اخبار
        </button>
      </form>
    </div>
  );
}