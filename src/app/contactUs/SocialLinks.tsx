// Social media links component
"use client";

import Image from "next/image";
import { ExternalLink, Headphones } from "lucide-react";
import aparat from "./../../../public/image/Aparat_Icon.png";
import rubika from "./../../../public/image/Rubika_Icon.png";
import { socialLinks } from "./constants";

interface SocialLinksProps {
  onCopySupport: () => void;
}

export default function SocialLinks({ onCopySupport }: SocialLinksProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
      <h3
        className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"
        style={{ fontFamily: "iranBold" }}
      >
        <ExternalLink className="w-5 h-5 text-secondary" />
        ما را دنبال کنید
      </h3>
      <p
        className="text-sm text-text-secondary mb-4"
        style={{ fontFamily: "iranSans-r" }}
      >
        در کانال‌های علمی ما عضو شوید و از جدیدترین دستاوردها مطلع گردید.
      </p>

      <div className="flex flex-col sm:grid grid-cols-2 gap-3">
        {/* Rubika */}
        <a
          href={socialLinks.rubika}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-600/10 to-purple-600/5 hover:from-purple-600/20 hover:to-purple-600/10 border border-purple-200/30 rounded-xl transition-all group"
        >
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
            <Image src={rubika} alt="روبیکا" className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-primary">روبیکا</p>
            <p className="text-[10px] text-text-secondary">elmiMontazeran</p>
          </div>
        </a>

        {/* Aparat */}
        <a
          href={socialLinks.aparat}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-600/10 to-red-600/5 hover:from-red-600/20 hover:to-red-600/10 border border-red-200/30 rounded-xl transition-all group"
        >
          <div className="bg-white p-2 rounded-lg shadow-lg shadow-red-500/25 group-hover:scale-110 transition-transform">
            <Image src={aparat} alt="آپارات" className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-primary">آپارات</p>
            <p className="text-[10px] text-text-secondary">elmiMontazeran</p>
          </div>
        </a>
      </div>

      {/* Support section */}
      <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-500/25">
            <Headphones className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p
              className="text-xs font-bold text-text-primary"
              style={{ fontFamily: "iranBold" }}
            >
              پشتیبانی در پیام رسان روبیکا
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-xs text-text-secondary"
                style={{ fontFamily: "iranSans-r" }}
              >
                آیدی:
              </span>
              <code className="text-xs bg-white/70 px-2 py-0.5 rounded border border-emerald-200 text-emerald-700 font-mono">
                {socialLinks.support}
              </code>
              <button
                onClick={onCopySupport}
                className="text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-0.5 rounded transition-colors"
              >
                کپی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}