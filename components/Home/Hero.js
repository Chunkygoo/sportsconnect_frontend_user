import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="bg-white">
      <div className="grid max-w-screen-2xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-bold md:font-extrabold leading-none md:text-5xl xl:text-6xl">
            {t('home:card_0_text_0')}
          </h1>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">
            {t('home:card_0_text_1')}
          </p>
          <Link href="/universities">
            <a className="inline-flex items-center justify-center px-2 sm:px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
              {t('home:card_0_text_2')}
            </a>
          </Link>
          <Link href="/steps">
            <a className="mt-4 inline-flex items-center justify-center px-2 sm:px-4 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
              {t('home:card_0_text_3')}
            </a>
          </Link>
        </div>
        <div className="mt-10 lg:mt-0 lg:col-span-5 lg:flex">
          {/* <img
            className="rounded"
            src="/athlete.png"
            alt="Athlete"
            width="800"
            height="500"
          /> */}
          <Image
            src={'/athlete.png'}
            className="rounded"
            alt="Athlete"
            width={800}
            height={500}
            blurDataURL={'/athlete_blurred.png'}
            placeholder="blur"
          />
        </div>
      </div>
    </section>
  );
}
