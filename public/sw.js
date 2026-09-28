// نصب سرویس ورکر
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// فعال‌سازی و کنترل فوری کلاینت‌ها
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// مدیریت درخواست‌ها و تشخیص قطعی اینترنت
self.addEventListener('fetch', (event) => {
  // فقط درخواست‌های GET را مدیریت می‌کنیم
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() => {
      // اگر اینترنت کاربر قطع شد
      if (event.request.headers.get('accept')?.includes('text/html')) {
        return new Response(
          `<!DOCTYPE html>
          <html lang="fa" dir="rtl">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>اینترنت پرید!</title>
            <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
            <style>
              body { 
                font-family: 'Vazirmatn', Tahoma, sans-serif; 
                background: #0f172a; 
                color: #f8fafc; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                margin: 0; 
                padding: 16px;
                text-align: center; 
              }
              .box { 
                background: #1e293b; 
                padding: 30px 24px; 
                border-radius: 24px; 
                box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.3); 
                max-width: 400px; 
                width: 100%; 
                border: 1px solid #334155;
              }
              .img-container {
                width: 100%;
                height: 180px;
                border-radius: 14px;
                margin-bottom: 20px;
                background: #0f172a;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                border: 1px solid #334155;
              }
              img {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
              .offline-icon {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #f87171;
              }
              .badge {
                display: inline-block;
                background: rgba(239, 68, 68, 0.15);
                color: #f87171;
                padding: 6px 16px;
                border-radius: 50px;
                font-size: 0.8rem;
                font-weight: bold;
                margin-bottom: 14px;
                border: 1px solid rgba(239, 68, 68, 0.3);
              }
              h1 { 
                font-size: 1.25rem; 
                margin: 0 0 10px 0; 
                color: #f1f5f9; 
              }
              p { 
                font-size: 0.9rem; 
                color: #94a3b8; 
                margin-bottom: 24px; 
                line-height: 1.6;
              }
              button { 
                background: #3b82f6; 
                color: white; 
                border: none; 
                padding: 12px 24px; 
                border-radius: 14px; 
                cursor: pointer; 
                font-size: 0.95rem; 
                font-weight: bold;
                width: 100%;
                transition: all 0.2s;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                font-family: 'Vazirmatn', sans-serif;
              }
              button:hover { 
                background: #2563eb; 
                transform: translateY(-1px);
              }
            </style>
          </head>
          <body>
            <div class="box">
              <div class="img-container">
                <!-- تلاش برای بارگذاری عکس اصلی، اگر نبود آیکون جایگزین می‌شود -->
                <img src="/image/c3.jpg" alt="قطعی اینترنت" onerror="this.style.display='none'; document.getElementById('fallback-icon').style.display='flex';">
                
                <!-- آیکون جایگزین قطعی نت در صورت عدم وجود تصویر -->
                <div id="fallback-icon" class="offline-icon" style="display: none;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                    <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                    <line x1="12" y1="20" x2="12.01" y2="20"></line>
                  </svg>
                  <span style="font-size: 11px; margin-top: 6px; color: #94a3b8;">سیگنال گم شد!</span>
                </div>
              </div>

              <div class="badge">🔌 سیم‌ها رو جویدن؟!</div>
              <h1>اینترنت پر کشید!</h1>
              <p>انگار کابل‌ها باهات قهر کردن یا مودم خوابش برده. یه نگاهی بهش بنداز، شاید بیدار شد!</p>
              <button onclick="window.location.reload()">جانِ من دوباره امتحان کن</button>
            </div>
          </body>
          </html>`,
          {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          }
        );
      }
      
      return new Response('Network error happened', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
      });
    })
  );
});