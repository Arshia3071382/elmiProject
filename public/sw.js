// نصب سرویس ورکر
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-cache-v1').then((cache) => {
      // کش کردن تصویر و صفحات ضروری برای دسترسی آفلاین
      return cache.addAll([
        '/image/c3.jpg'
      ]);
    })
  );
  self.skipWaiting();
});

// فعال‌سازی و کنترل فوری کلاینت‌ها
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// مدیریت درخواست‌ها و تشخیص قطعی اینترنت
self.addEventListener('fetch', (event) => {
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
            <!-- اضافه کردن فونت زیبا و استاندارد وزیر -->
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
              img {
                width: 100%;
                height: auto;
                max-height: 200px;
                object-fit: contain;
                border-radius: 12px;
                margin-bottom: 16px;
                background: #0f172a;
                padding: 8px;
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
              <!-- استفاده از آدرس کامل برای تصویر -->
              <img src="${location.origin}/image/c3.jpg" alt="قطعی اینترنت" onerror="this.style.display='none'">
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