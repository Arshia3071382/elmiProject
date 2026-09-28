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
      // اگر ارتباط با شبکه برقرار نشد (اینترنت کاربر قطع است)
      if (event.request.headers.get('accept')?.includes('text/html')) {
        return new Response(
          `<!DOCTYPE html>
          <html lang="fa" dir="rtl">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>قطع ارتباط با شبکه</title>
            <!-- فونت وزیرمتن برای خوانایی و زیبایی استاندارد -->
            <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
            <style>
              body { 
                font-family: 'Vazirmatn', Tahoma, sans-serif; 
                background: #f8fafc; 
                color: #1e293b; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                margin: 0; 
                padding: 16px;
                text-align: center; 
              }
              .box { 
                background: white; 
                padding: 30px 24px; 
                border-radius: 20px; 
                box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.08); 
                max-width: 420px; 
                width: 100%; 
                border: 1px solid #e2e8f0;
              }
              img {
                width: 100%;
                height: auto;
                max-height: 180px;
                object-fit: contain;
                border-radius: 12px;
                margin-bottom: 20px;
                background: #0f172a;
                padding: 10px;
              }
              .badge {
                display: inline-block;
                background: #fef2f2;
                color: #dc2626;
                padding: 6px 16px;
                border-radius: 50px;
                font-size: 0.85rem;
                font-weight: 600;
                margin-bottom: 14px;
                border: 1px solid #fee2e2;
              }
              h1 { 
                font-size: 1.25rem; 
                margin: 0 0 10px 0; 
                color: #1e293b; 
                font-weight: 700;
              }
              p { 
                font-size: 0.95rem; 
                color: #64748b; 
                margin-bottom: 24px; 
                line-height: 1.6;
              }
              button { 
                background: #0f172a; 
                color: white; 
                border: none; 
                padding: 12px 24px; 
                border-radius: 12px; 
                cursor: pointer; 
                font-size: 0.95rem; 
                font-weight: 600;
                width: 100%;
                transition: background 0.2s;
                font-family: 'Vazirmatn', sans-serif;
              }
              button:hover { background: #1e293b; }
            </style>
          </head>
          <body>
            <div class="box">
              <!-- استفاده از تصویر جایگزین پایدار برای حالت آفلاین -->
              <img src="/image/c3.jpg" alt="قطع ارتباط اینترنت" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M1 1l22 22\'/><path d=\'M16.72 11.06A10.94 10.94 0 0 1 19 12.55\'/><path d=\'M5 12.55a10.94 10.94 0 0 1 5.17-2.39\'/><path d=\'M10.71 5.05A16 16 0 0 1 22.58 9\'/><path d=\'M1.42 9a15.91 15.91 0 0 1 4.7-2.88\'/><path d=\'M8.53 16.11a6 6 0 0 1 6.95 0\'/><line x1=\'12\' y1=\'20\' x2=\'12.01\' y2=\'20\'/></svg>';">
              <div class="badge">⚠️ عدم دسترسی به شبکه</div>
              <h1>ارتباط با اینترنت برقرار نیست</h1>
              <p>در حال حاضر اتصال شما به اینترنت قطع می‌باشد. لطفاً پس از بررسی وضعیت شبکه و تجهیزات خود، مجدداً تلاش فرمایید.</p>
              <button onclick="window.location.reload()">تلاش مجدد و بروزرسانی صفحه</button>
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