'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../firebase';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Signed in
        router.push('/');
      })
      .catch((error) => {
        if (error.code == 'auth/invalid-credential') {
          alert('E-mail 又は Password が不正です');
        } else {
          alert(error.message);
        }
      });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="mb-4 text-2xl text-gray-700 font-medium">ログイン</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            {...register('email', {
              required: 'メールアドレスは必須です',
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                message: 'フォーマットが正しくありません',
              },
            })}
            type="text"
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.email && (
            <span className="text-red-600">{errors.email.message}</span>
          )}

          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            {...register('password', {
              required: 'パスワードは必須です',
            })}
            type="password"
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.password && (
            <span className="text-red-600">{errors.password.message}</span>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            ログイン
          </button>
        </div>
        <div className="mt-4">
          <span className="text-gray-600 text-sm">
            アカウントをお持ちでない場合
          </span>
          <Link
            href={'/auth/register'}
            className="text-blue-500 text-sm font-bold ml-1 hover:text-blue-700"
          >
            ユーザー登録ページへ
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
