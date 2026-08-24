// Contact info cards
"use client";

export default function ContactInfo() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
          <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
            <span className="text-green-500 text-sm">✓</span>
          </div>
          <div>
            <p
              className="text-sm font-medium text-text-primary"
              style={{ fontFamily: "iranSans-r" }}
            >
              پاسخگویی سریع
            </p>
            <p className="text-xs text-text-secondary">طی ۲۴ ساعت کاری</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
          <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
            <span className="text-blue-500 text-sm">🔒</span>
          </div>
          <div>
            <p
              className="text-sm font-medium text-text-primary"
              style={{ fontFamily: "iranSans-r" }}
            >
              حریم خصوصی
            </p>
            <p className="text-xs text-text-secondary">اطلاعات شما محفوظ است</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
          <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
            <span className="text-purple-500 text-sm">👨‍🔬</span>
          </div>
          <div>
            <p
              className="text-sm font-medium text-text-primary"
              style={{ fontFamily: "iranSans-r" }}
            >
              تیم متخصص
            </p>
            <p className="text-xs text-text-secondary">پاسخگویی توسط کارشناسان علمی</p>
          </div>
        </div>
      </div>
    </div>
  );
}