'use client';

import { useEffect, useState, useContext } from 'react';
import Navbar from './home/Navbar';
import Main from './home/Main';
import { DataContext } from './_providers/DataContext';
import { handleLoadCollectionGroup } from '@/app/lib/functionsServer';
import { checkToken } from '@/app/lib/functionsServer';
import { useRouter } from 'next/navigation';
import { CollectionGroup } from './lib/interfaces';
import { Routes } from './routes';

export default function Home() {
  const { initialDataContext, setDataContext } = useContext(DataContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(true);
      void checkToken().then((e) => {
        if (e) {
          setToken(e);
          handleLoadCollectionGroup({ token: e })
            .then((data) => {
              setDataContext(JSON.parse(JSON.stringify(data)) as CollectionGroup);
              initialDataContext.current = JSON.parse(JSON.stringify(data)) as CollectionGroup;
              setLoading(false);
            })
            .catch((error) => {
              console.error(error);
              router.push(Routes.login);
            });
        } else {
          router.push(Routes.login);
        }
      });
    }
  }, [initialDataContext, router, setDataContext, token]);

  if (token !== null)
    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-start overflow-hidden text-clip md:min-h-screen">
        <Navbar loading={loading} token={token} />
        <Main loading={loading} token={token} />
      </div>
    );
}
