'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { JWT } from 'next-auth/jwt';
import Image from 'next/image';

// for authjs
const ProfileForm = () => {
  const { data: session, status, update } = useSession();

  if (status === 'authenticated') {
    return (
      <>
        <p>Signed as {session?.user?.email}</p>
        <p>Name: {session?.user?.name}</p>
        <Image src={session?.user?.image ?? ''} alt="profile" width={100} height={100} />
        <button onClick={() => update({ name: 'joh23n', picture: '/john.img' } as JWT)}>
          Edit name
        </button>
      </>
    );
  }

  return <div>Loading... or not signed in</div>;
};


