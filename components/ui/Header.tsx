import Link from 'next/link';
import { FaGlassMartini, FaHeart, FaCog } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container-lg py-4">
        <div className="navbar bg-base-100 px-0">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link href="/" className="flex items-center gap-2"><FaGlassMartini /> 所有配方</Link></li>
                <li><Link href="/favorites" className="flex items-center gap-2"><FaHeart /> 我的收藏</Link></li>
                <li><Link href="/admin" className="flex items-center gap-2"><FaCog /> 管理后台</Link></li>
              </ul>
            </div>
            <Link href="/" className="btn btn-ghost text-xl">BreakThirst</Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><Link href="/" className="flex items-center gap-2"><FaGlassMartini /> 所有配方</Link></li>
              <li><Link href="/favorites" className="flex items-center gap-2"><FaHeart /> 我的收藏</Link></li>
              <li><Link href="/admin" className="flex items-center gap-2"><FaCog /> 管理后台</Link></li>
            </ul>
          </div>
          <div className="navbar-end">
            <Link href="/" className="btn btn-primary">
              添加新配方
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 