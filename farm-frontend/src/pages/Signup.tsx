import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link } from 'react-router';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['farmer', 'customer']),
});

type SignupInput = z.infer<typeof signupSchema>;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'customer',
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      // already logged in
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (values: SignupInput) => {
    try {
      await registerMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      navigate('/', { replace: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // attempt to parse error from API
      const msg =
        err?.response?.data?.message ||
        (err?.message ? err.message : 'Failed to register');
      if (msg.toLowerCase().includes('email')) {
        setError('email', { message: msg });
      } else {
        // generic
        alert(msg);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Sign Up to FarmDirect</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            {...register('name')}
            type="text"
            placeholder="Your full name"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

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
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
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
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium mb-1">I am a</label>
          <select
            {...register('role')}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="customer">Customer</option>
            <option value="farmer">Farmer</option>
          </select>
          {errors.role && (
            <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {registerMutation.isPending ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>
      </form>

      <div className="mt-4 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 underline">
          Log in
        </Link>
      </div>

      {registerMutation.isError && (
        <div className="mt-3 text-red-600 text-sm">
          {String(registerMutation.error?.message || registerMutation.error?.cause)}
        </div>
      )}
    </div>
  );
};

export default SignupPage;
