'use client';

import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isStrongPassword, registerUser } from '@/lib/auth';
import { FormSkeleton } from '@/components/skeleton';

interface User {
  name: string;
  email: string;
  password: string;
}

async function getAllRegisteredUsers(): Promise<User[]> {
  const savedUsers = localStorage.getItem('auth_users');
  return savedUsers ? JSON.parse(savedUsers) : [];
}

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] font-inter">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <FormSkeleton />
        </div>
      </main>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setShake(false);
  }

  function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  async function checkUserExists(email: string): Promise<boolean> {
    const users = await getAllRegisteredUsers();
    return users.some(user => user.email === email);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setShake(false);

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setShake(true);
      setError('Preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setShake(true);
      setError('Email inválido.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setShake(true);
      setError('Senha deve ter no mínimo 6 caracteres.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setShake(true);
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (!isStrongPassword(password)) {
      setShake(true);
      setError('A senha precisa ter uma letra maiúscula, um número e um caractere especial.');
      setLoading(false);
      return;
    }

    const userExists = await checkUserExists(email);

    if (userExists) {
      setShake(true);
      setError('Usuário já existe.');
      setLoading(false);
      return;
    }

    const response = await registerUser(name, password, email);

    if (!response.success) {
      setShake(true);
      setError(response.message);
      setLoading(false);
      return;
    }

    setSuccess('Cadastro realizado com sucesso!');
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] font-inter">
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4 animate-fade-in ${shake ? 'animate-shake' : ''}`}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">Criar conta</h1>

        <Input
          label="Nome"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Seu nome"
        />

        <Input
          label="E-mail"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
        />

        <Input
          label="Senha"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
        />

        <Input
          label="Confirmar Senha"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <SubmitButton title={loading ? "Cadastrando..." : "Cadastrar"} disabled={loading} />
      </form>
    </main>
  );
}