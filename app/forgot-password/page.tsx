import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '忘记密码 | BreakThirst',
  description: '重置您的BreakThirst账号密码。',
};

export default function ForgotPasswordPage() {
  return (
    <div className="container-lg py-12">
      <div className="max-w-md mx-auto">
        <h1 className="heading-lg text-center mb-6">找回密码</h1>
        <ForgotPasswordForm />
      </div>
    </div>
  );
} 