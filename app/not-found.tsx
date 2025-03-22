import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-lg py-12 min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">页面未找到</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        您访问的页面不存在或已被移除。请尝试访问其他页面或返回首页。
      </p>
      <Link href="/" className="btn btn-primary">
        返回首页
      </Link>
    </div>
  );
} 