'use server';
import { decrypt, encrypt } from 'next/dist/server/app-render/action-encryption-utils';
import { cookies } from 'next/headers';
import { auth, signIn, signOut } from '@/auth';
import { BuiltInProviderType } from '@auth/core/providers';

export const serverAction = async () => {
  const session = await auth();
  const name = session?.user?.name;
  if (session) {
    // name !== 'somesome'
    throw new Error('Unauthorized');
  }

  console.log('do action');
};

export const loginAction = async (
  provider: BuiltInProviderType,
  username?: string,
  password?: string,
) => {
  if (provider === 'credentials') {
    await wait(1000);
    await signIn(provider, { username: username, password: password, redirectTo: '/' });
  } else {
    await signIn(provider, { redirectTo: '/' });
  }
};
export const logoutAction = async () => {
  await signOut();
};

const wait = (timeToDelay: number) => new Promise((resolve) => setTimeout(resolve, timeToDelay)); //이와 같이 선언 후
