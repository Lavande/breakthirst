import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '重置密码 | BreakThirst',
  description: '重置您的BreakThirst账号密码。',
};

export default function ResetPasswordPage() {
  return (
    <div className="container-lg py-12">
      <div className="max-w-md mx-auto">
        <h1 className="heading-lg text-center mb-6">设置新密码</h1>
        <ResetPasswordForm />
      </div>
    </div>
  );
} 