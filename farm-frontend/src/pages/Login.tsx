import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link, useLocation } from 'react-router';

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

type LoginInput = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const from = (location.state as any)?.from || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const onSubmit = async (values: LoginInput) => {
    try {
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      navigate(from, { replace: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (err?.message ? err.message : 'Login failed');
      if (msg.toLowerCase().includes('credentials')) {
        setError('password', { message: 'Invalid email or password' });
        setError('email', { message: 'Invalid email or password' });
      } else {
        alert(msg);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg"> {/* adjust max-w if you want wider */}
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-2xl font-semibold mb-4 text-center">
            Log In to FarmDirect
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full border px-3 py-2 rounded"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  className="w-full border px-3 py-2 rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
              >
                {loginMutation.isPending ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-sm text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 underline">
              Sign up
            </Link>
          </div>

          {loginMutation.isError && (
            <div className="mt-3 text-red-600 text-sm text-center">
              {String(
                
                  loginMutation.error?.message ||
                  loginMutation.error?.cause
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
