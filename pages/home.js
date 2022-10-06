import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Benefits from '../components/Home/Benefits';
import Description from '../components/Home/Description';
import Features from '../components/Home/Features';
import Hero from '../components/Home/Hero';
import Process from '../components/Home/Process';

export default function Home() {
  const router = useRouter();
  // For Google login
  useEffect(() => {
    if (localStorage.getItem('lang') !== router.locale) {
      router.push(router.asPath, undefined, {
        locale: localStorage.getItem('lang'),
      });
    }
  });
  // End for Google login

  return (
    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl min-h-[80vh]">
      <Hero />
      <Features />
      <Benefits />
      <Process />
      <Description />
    </div>
  );
}
