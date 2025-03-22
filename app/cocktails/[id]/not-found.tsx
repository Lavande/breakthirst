import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-lg py-12 min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">鸡尾酒配方未找到</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        您查找的鸡尾酒配方不存在或已被移除。请尝试浏览其他配方或添加新配方。
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn btn-primary">
          浏览配方
        </Link>
        <Link href="/cocktails/extract" className="btn btn-outline">
          添加新配方
        </Link>
      </div>
    </div>
  );
} 