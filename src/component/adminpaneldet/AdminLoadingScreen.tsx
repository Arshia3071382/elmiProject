export default function AdminLoadingScreen() {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-600 font-bold text-sm">...در حال بررسی دسترسی</p>
      </div>
    </div>
  );
}