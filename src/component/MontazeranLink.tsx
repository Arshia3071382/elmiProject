import Image from "next/image";
import Container from "@/component/Container";

export default function MontazeranLink() {
  return (
    <Container>
      <a
        href="https://montazeran.ir"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ورود به سایت مجموعه منتظران"
        dir="rtl"
        className="
          group relative
          flex w-full items-center
          justify-between
          overflow-hidden
          rounded-[30px]
          border border-[#bbf7d0]/60
          bg-gradient-to-l
          from-[#f0fdf4]
          via-[#f8fffb]
          to-[#ffffff]
          px-5 py-4
          shadow-[0_8px_30px_rgba(34,197,94,0.07)]
          transition-all duration-300
          hover:-translate-y-0.5
          hover:shadow-[0_12px_35px_rgba(34,197,94,0.12)]
        "
      >
        {/* هاله سبز محو */}
        <div
          className="
            pointer-events-none
            absolute
            -right-20 -top-20
            h-44 w-44
            rounded-full
            bg-[#22c55e]/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-16 -bottom-20
            h-36 w-36
            rounded-full
            bg-[#16a34a]/5
            blur-3xl
          "
        />

        {/* محتوا - RTL */}
        <div className="relative z-10 flex min-w-0 items-center gap-8 md:gap-12">
          {/* لوگو - سمت راست */}
          <div
            className="
              relative
              h-[58px] w-[58px]
              shrink-0
              transition-transform duration-300
              group-hover:scale-105
            "
          >
            <Image
              src="/image/montazeran.png"
              alt="مجموعه منتظران"
              fill
              sizes="58px"
              className="
                object-contain
                drop-shadow-[0_5px_12px_rgba(22,163,74,0.18)]
              "
            />
          </div>

          {/* متن - سمت راست */}
          <div className="min-w-0 text-right">
            <p
              className="
                text-[15px]
                font-black
                text-[#1f3a5f]
                md:text-[18px]
              "
            >
              مجموعه منتظران
            </p>

            <p
              className="
                mt-1
                text-[11px]
                font-medium
                text-slate-500
                md:text-[13px]
              "
            >
              ورود به سایت اصلی مجموعه
            </p>
          </div>
        </div>

        {/* آیکون ورود - سمت چپ */}
        <div
          className="
            relative z-10
            flex h-11 w-11
            shrink-0
            items-center justify-center
            rounded-2xl
            border border-[#bbf7d0]
            bg-white/80
            text-[#16a34a]
            shadow-sm
            backdrop-blur-sm
            transition-all duration-300
            group-hover:bg-[#16a34a]
            group-hover:text-white
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 17l5-5-5-5"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3" />
          </svg>
        </div>
      </a>
    </Container>
  );
}
