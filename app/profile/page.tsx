'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProfileForm from '@/components/auth/ProfileForm';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  if (isLoading) {
    return (
      <div className="container-lg py-12 flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="container-lg py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-lg mb-6">个人资料</h1>
        <div className="space-y-8">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
} 