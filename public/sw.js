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
            <title>اینترنت قطع شد</title>
            <style>
              body { 
                font-family: Tahoma, sans-serif; 
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
                padding: 24px; 
                border-radius: 20px; 
                box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1); 
                max-width: 450px; 
                width: 100%; 
                border: 1px solid #e2e8f0;
              }
              img {
                width: 100%;
                height: auto;
                border-radius: 12px;
                margin-bottom: 16px;
                background: #0f172a;
              }
              .badge {
                display: inline-block;
                background: #fef2f2;
                color: #dc2626;
                padding: 6px 14px;
                border-radius: 50px;
                font-size: 0.85rem;
                font-weight: bold;
                margin-bottom: 12px;
                border: 1px solid #fee2e2;
              }
              h1 { 
                font-size: 1.3rem; 
                margin: 0 0 8px 0; 
                color: #1e293b; 
              }
              p { 
                font-size: 0.95rem; 
                color: #64748b; 
                margin-bottom: 20px; 
                line-height: 1.5;
              }
              button { 
                background: #0f172a; 
                color: white; 
                border: none; 
                padding: 12px 24px; 
                border-radius: 12px; 
                cursor: pointer; 
                font-size: 0.95rem; 
                font-weight: bold;
                width: 100%;
                transition: background 0.2s;
              }
              button:hover { background: #1e293b; }
            </style>
          </head>
          <body>
            <div class="box">
              <img src="/image/c3.jpg" alt="قطعی اینترنت">
              <div class="badge">⚠️ ارتباط با شبکه قطع شد</div>
              <h1>اینترنت قطع شد!</h1>
              <p>به نظر می‌رسد ارتباط شما با اینترنت قطع شده است. لطفاً مودم یا اتصال خود را بررسی کرده و مجدداً تلاش کنید.</p>
              <button onclick="window.location.reload()">تلاش مجدد و بروزرسانی</button>
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