import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'BreakThirst | 发现、收集、分享鸡尾酒配方',
  description: '使用BreakThirst轻松提取、保存和分享你喜爱的鸡尾酒配方。一键从网页中提取配料和步骤，创建自己的鸡尾酒收藏。',
  authors: [{ name: 'BreakThirst Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" data-theme="breakthirst">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
} 