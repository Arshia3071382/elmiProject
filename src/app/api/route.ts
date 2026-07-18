// اضافه کردن const در انتهای آبجکت برای فیکس شدن تایپ کاتگوری‌ها و نوع سوالات
const initialQuizData = {
  title: "آزمون جامع علاقه‌سنجی و هدایت شغلی تخصصی علوم انسانی",
  targetBranch: "علوم انسانی",
  version: 1,
  boxes: [
    {
      "boxNumber": 1,
      "category": "academic_lessons",
      "title": "باکس ۱: چالش درک مفاهیم انتزاعی و استدلالی",
      "description": "هنگام مطالعه دروس فلسفه و منطق، کدام رویکرد ذهن شما را بیشتر درگیر می‌کند؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "عاشق تحلیل مغالطه‌ها و کشف روابط منطقی بین قضایا هستم.", "scoreTag": "philosophy_law" },
        { "optionText": "بیشتر به جنبه‌های کاربردی و تاثیر این مکاتب بر رفتار انسان‌ها علاقه دارم.", "scoreTag": "psychology_sociology" },
        { "optionText": "حفظ کردن نظریات دانشمندان برایم راحت‌تر از تحلیل فرمول‌های منطقی است.", "scoreTag": "history_literature" },
        { "optionText": "این دروس برایم خسته‌کننده است و ترجیح می‌دهم مسائل محاسباتی یا زبانی را حل کنم.", "scoreTag": "management_languages" }
      ]
    },
    {
      "boxNumber": 2,
      "category": "career_future",
      "title": "باکس ۲: محیط کاری ایده‌آل در آینده",
      "description": "تصور کنید فارغ‌التحصیل شده‌اید؛ خود را در کدام یک از موقعیت‌های زیر فعال‌تر و موفق‌تر می‌بینید؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "دادگاه‌ها، دفاتر حقوقی و حل دعاوی پیچیده قانونی و قضایی", "scoreTag": "law" },
        { "optionText": "کلینیک‌های مشاوره، بیمارستان‌ها یا مراکز درمانی روان‌شناختی", "scoreTag": "psychology" },
        { "optionText": "محیط‌های پویای شرکتی, سازمان‌های دولتی و مدیریت تیم‌های کاری", "scoreTag": "management" },
        { "optionText": "مدارس، دانشگاه‌ها و فضاهای آموزشی و تربیتی", "scoreTag": "education" }
      ]
    },
    {
      "boxNumber": 3,
      "category": "academic_lessons",
      "title": "باکس ۳: میانه شما با ادبیات و آرایه‌های ادبی",
      "description": "درس علوم و فنون ادبی (عروض، قافیه و آرایه‌ها) برای شما چگونه است؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "کشف آهنگ شعر (تقطیع سماعی) و تحلیل استعاره‌ها برایم مثل یک سرگرمی لذت‌بخش است.", "scoreTag": "literature" },
        { "optionText": "صرفاً برای کسب نمره بالا و به عنوان یک درس رتبه‌ساز به آن نگاه می‌کنم.", "scoreTag": "general_humanities" },
        { "optionText": "حفظ کردن بخش تاریخ ادبیات و سبک‌شناسی را به بخش عروض و قافیه ترجیح می‌دهم.", "scoreTag": "history_education" },
        { "optionText": "ارتباط خوبی با این درس برقرار نمی‌کنم و ترجیح می‌دهم وقتم را روی دروس فرمولی‌تر بگذارم.", "scoreTag": "management_law" }
      ]
    },
    {
      "boxNumber": 4,
      "category": "skills_talents",
      "title": "باکس ۴: توانایی و مهارت سخنوری و متقاعدسازی",
      "description": "در یک بحث گروهی یا مناظره، واکنش معمول شما چیست؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "با تکیه بر مستندات، قوانین و استدلال‌های محکم، سریعاً طرف مقابل را متقاعد می‌کنم.", "scoreTag": "law" },
        { "optionText": "بیشتر سعی می‌کنم ریشه احساسات و دلایل پنهان رفتار طرف مقابل را درک کنم تا قضاوت کردن.", "scoreTag": "psychology" },
        { "optionText": "بحث را مدیریت می‌کنم تا گروه به یک نتیجه‌گیری مشترک و اجرایی برسد.", "scoreTag": "management" },
        { "optionText": "با لحنی آرام و آموزنده، سعی در روشن کردن صورت مسئله برای دیگران دارم.", "scoreTag": "education" }
      ]
    },
    {
      "boxNumber": 5,
      "category": "academic_lessons",
      "title": "باکس ۵: غول ریاضی در رشته انسانی",
      "description": "نگرش شما نسبت به درس ریاضی و آمار در رشته انسانی چیست؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "به بخش آمار، نمودارها و تحلیل داده‌های عددی علاقه دارم و در آن قویم.", "scoreTag": "management_economics" },
        { "optionText": "برایم سخت است اما می‌دانم کلید موفقیت در رتبه کنکور است و با فرمول‌ها کنار می‌آیم.", "scoreTag": "law_psychology" },
        { "optionText": "ترجیح می‌دهم تمام تمرکزم را روی دروس ۱۰۰٪ حفظی و توصیفی بگذارم.", "scoreTag": "history_literature" }
      ]
    },
    {
      "boxNumber": 6,
      "category": "personality_traits",
      "title": "باکس ۶: مواجهه با بحران‌ها و آسیب‌های اجتماعی",
      "description": "وقتی با اخبار مربوط به آسیب‌های اجتماعی (مثل فقر، طلاق یا اعتیاد) مواجه می‌شوید، ذهن شما بیشتر درگیر چه می‌شود؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "تحلیل ریشه‌های کلان جامعه‌شناختی، ساختارها و سیاست‌گذاری‌های دولتی.", "scoreTag": "sociology_political" },
        { "optionText": "بررسی اثرات روانی این آسیب‌ها روی تک‌تک افراد خانواده و راه‌های درمان فردی.", "scoreTag": "psychology" },
        { "optionText": "خلاءهای قانونی که باعث بروز این مشکلات شده و نحوه احقاق حقوق افراد آسیب‌دیده.", "scoreTag": "law" }
      ]
    },
    {
      "boxNumber": 7,
      "category": "academic_lessons",
      "title": "باکس ۷: زبان عربی؛ قواعد یا ترجمه؟",
      "description": "در درس عربی تخصصی انسانی، نقطه قوت شما کدام است؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "تحلیل صرفی، محل اعرابی و قواعد پیچیده (مثل نواسخ، معتل و...).", "scoreTag": "law_arabic" },
        { "optionText": "درک مطلب, ترجمه متون و ارتباط با مفاهیم کاربردی زبان.", "scoreTag": "literature_tourism" },
        { "optionText": "کل درس عربی برای من یک چالش بزرگ است و تمایل کمتری به آن دارم.", "scoreTag": "history_geography" }
      ]
    },
    {
      "boxNumber": 8,
      "category": "career_future",
      "title": "باکس ۸: درآمدزایی در بازار کار علوم انسانی",
      "description": "کدام مدل کسب درآمد برای آینده شما اولویت و جذابیت بیشتری دارد؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "حق‌الوکاله بالا یا درآمدهای پروژه‌ای سنگین ناشی از حل پرونده‌های تجاری/حقوقی.", "scoreTag": "law" },
        { "optionText": "داشتن مطب شخصی یا مرکز مشاوره با درآمد وابسته به شهرت و مهارت فردی.", "scoreTag": "psychology" },
        { "optionText": "حقوق ثابت، امنیت شغلی بالا و مزایای بازنشستگی (مثل دبیری آموزش و پرورش).", "scoreTag": "education" },
        { "optionText": "راه‌اندازی استارتاپ، مشاوره مدیریت به شرکت‌ها و درآمدهای مبتنی بر بیزینس.", "scoreTag": "management_economics" }
      ]
    },
    {
      "boxNumber": 9,
      "category": "skills_talents",
      "title": "باکس ۹: مهارت‌های نوشتاری و خلق متن",
      "description": "چقدر به نوشتن مقالات علمی، متون ادبی، یادداشت‌های تحلیلی یا روزنامه‌نگاری علاقه‌مندی؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "بسیار زیاد؛ توانایی بالایی در نگارش متون زیبا، متقاعدکننده و نویسندگی دارم.", "scoreTag": "literature_journalism" },
        { "optionText": "نوشتن لوایح دفاعی یا گزارش‌های دقیق اداری و مستند را به متن‌های ادبی ترجیح می‌دهم.", "scoreTag": "law_management" },
        { "optionText": "فقط در حد رفع نیازهای تحصیلی به نوشتن علاقه دارم و کار شفاهی را ترجیح می‌دهم.", "scoreTag": "education_psychology" }
      ]
    },
    {
      "boxNumber": 10,
      "category": "academic_lessons",
      "title": "باکس ۱۰: سفر در زمان و تحلیل گذشته (تاریخ و جغرافیا)",
      "description": "یادگیری جزییات تاریخی، نقشه‌ها و تمدن‌های گذشته چه حسی به شما می‌دهد؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "عاشق تحلیل علت سقوط امپراتوری‌ها و ارتباط گذشته با سیاست امروز هستم.", "scoreTag": "history_political" },
        { "optionText": "صرفاً حفظ کردن جزییات برایم جذاب است و حافظه تصویری خوبی روی نقشه‌ها دارم.", "scoreTag": "geography_education" },
        { "optionText": "این دروس را بیش از حد حفظی می‌دانم و ترجیح می‌دهم دروسی با تحلیل زنده (مثل روانشناسی) بخوانم.", "scoreTag": "psychology_management" }
      ]
    },
    {
      "boxNumber": 11,
      "category": "personality_traits",
      "title": "باکس ۱۱: میزان درون‌گرایی و برون‌گرایی در شغل آینده",
      "description": "ترجیح می‌دهید روز کاری خود را چگونه بگذرانید？",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "در آرامش اتاق شخصی، به صورت انفرادی روی کیس‌ها، کتاب‌ها یا پرونده‌ها تحقیق کنم.", "scoreTag": "research_literature" },
        { "optionText": "در ارتباط دائم، چهره به چهره و گوش دادن فعال به مشکلات یا تدریس به انسان‌ها.", "scoreTag": "psychology_education" },
        { "optionText": "در جلسات فشرده، مذاکرات تجاری، دادگاه‌ها یا محیط‌های پر سر و صدا و پویا.", "scoreTag": "law_management" }
      ]
    },
    {
      "boxNumber": 12,
      "category": "career_future",
      "title": "باکس ۱۲: اشتیاق به دنیای تجارت و مارکتینگ",
      "description": "نگاه شما به بهینه‌سازی فرآیندهای مالی، بورس، اقتصاد و مدیریت شرکت‌ها چیست؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "فرمول‌های اقتصادی و بازاریابی برایم بسیار جذابند و دوست دارم یک مدیر یا مشاور اقتصادی باشم.", "scoreTag": "management_economics" },
        { "optionText": "بیشتر به جنبه حقوقی شرکت‌ها (حقوق تجارت) علاقه دارم تا خودِ فرآیند مالی خرید و فروش.", "scoreTag": "law" },
        { "optionText": "علاقه‌ای به دنیای حساب‌وکتاب و تجارت ندارم و ترجیح می‌دهم در فضای فرهنگی-انسانی بمانم.", "scoreTag": "cultural_humanities" }
      ]
    },
    {
      "boxNumber": 13,
      "category": "skills_talents",
      "title": "باکس ۱۳: قدرت حافظه بلندمدت در مقابل هوش هیجانی",
      "description": "فکر می‌کنید بزرگترین ابزار ذهنی شما در میان گزینه‌های زیر کدام است؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "حافظه فوق‌العاده در به خاطر سپردن متون حجیم، کتب قانونی و جزییات تاریخی.", "scoreTag": "law_history" },
        { "optionText": "خلاقیت بالا در تحلیل شعر، داستان‌سرایی و درک استعاره‌ها و هنر.", "scoreTag": "literature_art" },
        { "optionText": "هوش اجتماعی بالا، توانایی خواندن زبان بدن دیگران و همدلی عمیق.", "scoreTag": "psychology_sociology" }
      ]
    },
    {
      "boxNumber": 14,
      "category": "career_future",
      "title": "باکس ۱۴: تمایل به مهاجرت تحصیلی یا شغلی",
      "description": "چقدر برایتان مهم است که رشته دانشگاهی شما، پتانسیل بالایی برای اپلای و کار در خارج از کشور داشته باشد؟",
      "questionType": "multiple_choice",
      "options": [
        { "optionText": "بسیار زیاد؛ می‌خواهم رشته‌ای مثل روانشناسی یا مدیریت بخوانم که در دنیا زبان مشترک دارد.", "scoreTag": "psychology_management_global" },
        { "optionText": "برعکس، ترجیح می‌دهم در داخل کشور در مشاغل بومی و پایدار (مثل وکالت ایران یا دبیری) فعالیت کنم.", "scoreTag": "law_education_local" }
      ]
    },
    {
      "boxNumber": 15,
      "category": "personality_traits",
      "title": "باکس ۱۵: خودارزیابی نهایی تشریحی (چشم‌انداز دانش‌آموز)",
      "description": "در چند جمله کوتاه توضیح دهید که در حال حاضر، جذاب‌ترین و بزرگترین ایده شما از «موفقیت یک فارغ‌التحصیل علوم انسانی» چیست؟",
      "questionType": "text"
    }
  ]
} as const; // <--- با اضافه شدن این بخش، ارور تایپ فیکس می‌شود.