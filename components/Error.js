import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import myAxiosPrivate from '../network/myAxiosPrivate';

export default function Error() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        let myAxios = await myAxiosPrivate();
        let res = await myAxios.get(`/healthdata`).catch((e) => {
          throw new Error(e);
        });
        if (res?.status === 200) {
          router.back();
        }
      } catch (_) {
        router.push(router.asPath, undefined, {
          locale: localStorage.getItem('lang'),
        });
      }
    }, 10000);
    return () => {
      clearTimeout(timer);
    };
  });
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <h1 className="mb-2 text-2xl">An error occured...</h1>
        <div>
          <p className="mt-4">
            Sorry about that! Please refresh the page or try again later.
          </p>
          <p>Team SportsConnect</p>
        </div>
      </div>
    </div>
  );
}
