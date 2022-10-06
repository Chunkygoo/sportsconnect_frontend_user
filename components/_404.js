import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

export default function _404({ description }) {
  const { t } = useTranslation();
  let desc = t('_404:description');
  if (description === 'user') {
    desc = t('_404:usernotfound');
  }
  return (
    <div className="h-screen w-screen bg-gray-50 flex justify-center items-center bg-black">
      <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
        <div className="w-full lg:w-1/2 mx-8">
          <div className="text-7xl font-dark font-extrabold mb-8"> 404</div>
          <p className="text-2xl md:text-3xl font-light leading-normal mb-8">
            {desc}
          </p>
          <Link href="/home">
            <a
              href="#"
              className="px-5 inline py-3 text-sm font-medium leading-5 shadow-2xl text-black transition-all duration-400 border border-transparent rounded-lg focus:outline-none bg-white text-xl"
            >
              {t('_404:back')}
            </a>
          </Link>
        </div>
        <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
          <Image src="/404.png" alt="Page not found" width={800} height={500} />
          {/* <img src="/404.png" alt="Page not found" width="800" height="500" /> */}
        </div>
      </div>
    </div>
  );
}
