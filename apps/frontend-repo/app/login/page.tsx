'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import LoginForm from '../../components/molecules/LoginForm';
import AuthTemplate from '../../components/templates/AuthTemplate';
import { RootState } from '../../store';

export default function LoginPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
}