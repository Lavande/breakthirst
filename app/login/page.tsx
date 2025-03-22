import AuthForm from '@/components/auth/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '登录 | BreakThirst',
  description: '登录您的BreakThirst账号，发现、收集、分享鸡尾酒配方。',
};

export default function LoginPage() {
  return (
    <div className="container-lg py-12">
      <div className="max-w-md mx-auto">
        <h1 className="heading-lg text-center mb-6">欢迎回来</h1>
        <AuthForm type="login" />
      </div>
    </div>
  );
} 