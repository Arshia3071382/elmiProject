import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // اگر بخشی مثل پنل ادمین دارید که نمی‌خواهید گوگل ایندکس کند، می‌توانید اینجا اضافه کنید:
      // disallow: '/admin/',
    },
    sitemap: 'https://elmi-montazeran.ir/sitemap.xml',
  };
}