'use server';

import { cookies } from 'next/headers';
import { CollectionGroup } from './interfaces';
import { redirect } from 'next/navigation';
import { Routes } from '../routes';
import type { Message } from '@/app/lib/interfaces';

const server = process.env.SERVER;
if (!server) throw new Error('Server not defined');

export const checkToken = async () => {
  const token = cookies().get('token')?.value;
  await Promise.resolve(token);
  if (!token) return null;
  return token;
};

export const clearToken = async () => {
  await Promise.resolve();
  cookies().delete('token');
};

export const handleLoadCollectionGroup = async ({ token }: { token: string }) => {
  try {
    const response = await fetch(server, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = (await response.json()) as CollectionGroup;
      return data;
    } else {
      console.error('Failed to load collection group', response);
    }
  } catch (error) {
    console.error(error);
  }
};

export const handleSaveCollectionGroup = async ({ data, token }: { data: CollectionGroup; token: string }) => {
  try {
    const response = await fetch(server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return true;
    } else {
      console.error('Failed to save collection group', response);
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export async function createInvoiceCreateEmail(prev: Message, formData: FormData): Promise<Message> {
  if (formData.get('password') !== formData.get('passwordConfirm'))
    return {
      message: 'Passwords do not match',
    };
  let response;
  try {
    response = await fetch(`${server}create-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });

    if (response.ok) {
      const { token } = (await response.json()) as { token: string };
      cookies().set({ name: 'token', value: token, httpOnly: true });
      return { message: '' };
    }
  } catch (error) {
    return { message: 'Server error' };
  } finally {
    if (response?.status === 200) redirect(Routes.home);
    else if (response?.status === 400) return { message: 'User already exists' };
    else return { message: 'Server error' };
  }
}

export async function createInvoiceLogin(prev: Message, formData: FormData): Promise<Message> {
  let response;
  try {
    response = await fetch(`${server}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });
    if (response.ok) {
      const { token } = (await response.json()) as { token: string };
      cookies().set({ name: 'token', value: token, httpOnly: true });
      return { message: '' };
    } else {
      return { message: 'Invalid credentials' };
    }
  } catch (error) {
    return { message: 'Server error' };
  } finally {
    if (response?.status === 200) {
      redirect(Routes.home);
    }
  }
}

export async function createInvoiceResetRequest(prev: Message, formData: FormData): Promise<Message> {
  let response;
  try {
    response = await fetch(`${server}reset-password/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.get('email'),
      }),
    });
    if (response.ok) {
      return { message: 'success' };
    } else {
      return {
        message: 'success',
      };
    }
  } catch (error) {
    return { message: 'Server error' };
  }
}

export async function createInvoiceReset(prev: Message, formData: FormData, token: string): Promise<Message> {
  if (formData.get('password') !== formData.get('passwordConfirm'))
    return {
      message: 'Passwords do not match',
    };

  let response;
  try {
    response = await fetch(`${server}reset-password/reset/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: formData.get('password'),
        token: token,
      }),
    });

    if (response.ok) {
      const { token } = (await response.json()) as { token: string };
      cookies().set({ name: 'token', value: token, httpOnly: true });
      return { message: 'success' };
    } else {
      return {
        message: 'Failed to reset password',
      };
    }
  } catch (error) {
    return { message: 'Server error' };
  } finally {
    if (response?.status === 200) {
      redirect(Routes.home);
    }
  }
}
