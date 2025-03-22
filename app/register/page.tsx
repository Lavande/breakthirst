import AuthForm from '@/components/auth/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '注册 | BreakThirst',
  description: '创建您的BreakThirst账号，开始发现、收集、分享鸡尾酒配方。',
};

export default function RegisterPage() {
  return (
    <div className="container-lg py-12">
      <div className="max-w-md mx-auto">
        <h1 className="heading-lg text-center mb-6">创建新账号</h1>
        <AuthForm type="register" />
      </div>
    </div>
  );
}
