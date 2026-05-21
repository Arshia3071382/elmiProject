"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Sparkles,
  Users,
  Star,
  PlayCircle,
  Calendar,
  GraduationCap,
  ChevronRight,
  LayoutGrid
} from "lucide-react";
import Container from "./../../component/Container";

interface Category {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
  category: Category;
  createdAt: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const url = selectedCategory 
        ? `/api/courses?category=${selectedCategory}`
        : "/api/courses";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("خطا:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Container>
        <main dir="rtl" className="py-8">
          
          {/* هدر جدید - کوچک و ساده */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-10 rounded-full mb-3">
                <GraduationCap className="w-4 h-4" style={{ color: '#2563EB' }} />
                <span className="text-sm" style={{ color: '#2563EB', fontFamily: 'iranSans-r' }}>
                 مجموعه علمی منتظران
                </span>
              </div>
              <h1 
                className="text-3xl font-bold mb-2" 
                style={{ color: '#1F3A5F', fontFamily: 'iranBold' }}
              >
                دوره‌های آموزشی
              </h1>
              <p 
                className="text-base" 
                style={{ color: '#475569', fontFamily: 'iranSans-r' }}
              >
                جدیدترین و تخصصی‌ترین دوره‌های آموزشی
              </p>
            </motion.div>
          </div>

          {/* فیلتر گروه‌ها */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory("")}
                className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  !selectedCategory
                    ? "text-white shadow-md"
                    : "bg-white hover:shadow-md border"
                }`}
                style={{
                  backgroundColor: !selectedCategory ? '#2563EB' : '#FFFFFF',
                  color: !selectedCategory ? '#FFFFFF' : '#475569',
                  borderColor: '#E5E7EB',
                  fontFamily: 'iranSans-r'
                }}
              >
                <LayoutGrid className="w-4 h-4" />
                همه دوره‌ها
                <span 
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{
                    backgroundColor: !selectedCategory ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                    color: !selectedCategory ? '#FFFFFF' : '#475569'
                  }}
                >
                  {courses.length}
                </span>
              </motion.button>
              
              {categories.map((cat) => (
                <motion.button
                  key={cat._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === cat._id
                      ? "text-white shadow-md"
                      : "bg-white hover:shadow-md border"
                  }`}
                  style={{
                    backgroundColor: selectedCategory === cat._id ? '#2563EB' : '#FFFFFF',
                    color: selectedCategory === cat._id ? '#FFFFFF' : '#475569',
                    borderColor: '#E5E7EB',
                    fontFamily: 'iranSans-r'
                  }}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* نمایش دوره‌ها */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                  <div className="w-12 h-12 border-4 rounded-full animate-spin absolute top-0 left-0 border-t-transparent" style={{ borderColor: '#2563EB', borderTopColor: 'transparent' }}></div>
                </div>
                <p className="mt-4 text-sm" style={{ color: '#475569', fontFamily: 'iranSans-r' }}>در حال بارگذاری دوره‌ها...</p>
              </motion.div>
            ) : courses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10" style={{ color: '#94A3B8' }} />
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#1F3A5F', fontFamily: 'iranBold' }}>دوره‌ای یافت نشد</h3>
                <p className="text-sm" style={{ color: '#475569', fontFamily: 'iranSans-r' }}>
                  {selectedCategory ? "در این گروه دوره‌ای وجود ندارد" : "هنوز دوره‌ای ثبت نشده است"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {courses.map((course, idx) => {
                  const isNew = new Date(course.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  
                  return (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      whileHover={{ y: -4 }}
                      onHoverStart={() => setHoveredCard(course._id)}
                      onHoverEnd={() => setHoveredCard(null)}
                      className="group"
                    >
                      <div 
                        className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                        style={{ 
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E5E7EB'
                        }}
                      >
                        {/* بخش بالایی کارت */}
                        <div 
                          className="relative h-24 overflow-hidden"
                          style={{ backgroundColor: '#1F3A5F' }}
                        >
                          <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)' }}></div>
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                          
                          {/* آیکون */}
                          <div className="absolute bottom-3 right-3">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1.5">
                              <GraduationCap className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          
                          {/* برچسب جدید */}
                          {isNew && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 shadow-lg"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              جدید
                            </motion.div>
                          )}
                        </div>
                        
                        {/* محتوای کارت */}
                        <div className="p-4">
                          {/* گروه */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                              <BookOpen className="w-2.5 h-2.5" style={{ color: '#2563EB' }} />
                            </div>
                            <span 
                              className="text-xs font-medium px-2 py-0.5 rounded-md"
                              style={{ 
                                backgroundColor: '#EFF6FF',
                                color: '#2563EB',
                                fontFamily: 'iranSans-r'
                              }}
                            >
                              {course.category?.name || "بدون گروه"}
                            </span>
                          </div>
                          
                          {/* عنوان */}
                          <h3 
                            className="text-base font-bold mb-2 line-clamp-2 transition-colors group-hover:text-blue-600"
                            style={{ color: '#1F3A5F', fontFamily: 'iranBold' }}
                          >
                            {course.name}
                          </h3>
                          
                          {/* توضیحات کوتاه */}
                          <p 
                            className="text-xs mb-3 line-clamp-2"
                            style={{ color: '#475569', fontFamily: 'iranSans-r' }}
                          >
                            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ
                          </p>
                          
                          {/* اطلاعات و دکمه */}
                          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                <span className="text-xs" style={{ color: '#94A3B8', fontFamily: 'iranSans-r' }}>
                                  {new Date(course.createdAt).toLocaleDateString("fa-IR")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" style={{ color: '#94A3B8' }} />
                                <span className="text-xs" style={{ color: '#94A3B8', fontFamily: 'iranSans-r' }}>
                                  ۱۲۴
                                </span>
                              </div>
                            </div>
                            
                            {/* دکمه مشاهده */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1"
                              style={{ 
                                backgroundColor: '#2563EB',
                                color: '#FFFFFF',
                                fontFamily: 'iranSans-r'
                              }}
                            >
                              مشاهده
                              <ChevronRight className="w-2.5 h-2.5" />
                            </motion.button>
                          </div>
                        </div>
                        
                        {/* نوار پایین هاور */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: hoveredCard === course._id ? 1 : 0 }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
                          style={{ backgroundColor: '#38BDF8' }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* آمار پایین */}
          {courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 p-5 rounded-xl"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB'
              }}
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: '#EFF6FF' }}>
                    <BookOpen className="w-4 h-4" style={{ color: '#2563EB' }} />
                  </div>
                  <p className="text-lg font-bold" style={{ color: '#1F3A5F', fontFamily: 'iranBold' }}>{courses.length}</p>
                  <p className="text-xs" style={{ color: '#475569', fontFamily: 'iranSans-r' }}>دوره</p>
                </div>
                <div className="text-center">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: '#F0FDF4' }}>
                    <Users className="w-4 h-4" style={{ color: '#22C55E' }} />
                  </div>
                  <p className="text-lg font-bold" style={{ color: '#1F3A5F', fontFamily: 'iranBold' }}>{categories.length}</p>
                  <p className="text-xs" style={{ color: '#475569', fontFamily: 'iranSans-r' }}>گروه</p>
                </div>
                <div className="text-center">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: '#FEF3C7' }}>
                    <Star className="w-4 h-4" style={{ color: '#F59E0B' }} />
                  </div>
                  <p className="text-lg font-bold" style={{ color: '#1F3A5F', fontFamily: 'iranBold' }}>۴.۸</p>
                  <p className="text-xs" style={{ color: '#475569', fontFamily: 'iranSans-r' }}>امتیاز</p>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </Container>
    </div>
  );
}