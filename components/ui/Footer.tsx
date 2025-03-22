import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content mt-10">
      <div className="container-lg py-8">
        <div className="footer">
          <div>
            <span className="footer-title">BreakThirst</span>
            <p className="max-w-md">收集、提取、分享你最喜爱的鸡尾酒配方，轻松找到心仪的饮品。</p>
          </div>
          <div>
            <span className="footer-title">网站</span>
            <Link href="/" className="link link-hover">首页</Link>
            <Link href="/favorites" className="link link-hover">我的收藏</Link>
            <Link href="/admin" className="link link-hover">管理后台</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-700 text-center">
          <p>&copy; {new Date().getFullYear()} BreakThirst. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
} 