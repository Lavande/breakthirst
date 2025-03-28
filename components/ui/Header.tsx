'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaGlassMartini, FaHeart, FaCog, FaUserCircle, FaPlus } from 'react-icons/fa';
import { useAuth } from '@/lib/context/AuthContext';

export default function Header() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAddRecipe = () => {
    if (user) {
      router.push('/routes/add');
    } else {
      router.push('/login');
    }
  };

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
            <button onClick={handleAddRecipe} className="btn btn-secondary mr-2 flex items-center gap-2">
              <FaPlus /> 添加配方
            </button>
            
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost flex items-center gap-2">
                  <FaUserCircle className="text-xl" />
                  <span>{user.user_metadata?.full_name || user.email}</span>
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><Link href="/profile">个人资料</Link></li>
                  <li><Link href="/profile/password">修改密码</Link></li>
                  <li><a onClick={handleSignOut}>退出登录</a></li>
                </ul>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="btn btn-ghost">
                  登录
                </Link>
                <Link href="/register" className="btn btn-primary">
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 