import React, { useEffect, useRef, useState } from 'react';
import { GlobeAltIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import listenForOutsideClick from '../../utilities/listenForOutsideClick';

export default function LanguageDropdown({ setIsNavOpen }) {
  const [showLang, setShowLang] = useState(false);
  let router = useRouter();
  const divRef = useRef(null);
  const [listening, setListening] = useState(false);
  useEffect(() => {
    listenForOutsideClick(listening, setListening, divRef, () => {
      setShowLang(false);
    })();
  }, [listening]);
  return (
    <div ref={divRef} className="inline-block text-left relative">
      <div>
        <button
          type="button"
          className="block text-gray-700 rounded lg:bg-transparent lg:p-0 px-4 focus:outline-0"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setShowLang(!showLang)}
        >
          <GlobeAltIcon className="mt-0.5 -mr-1 h-5 w-7" />
        </button>
      </div>
      <div
        className={
          'origin-top-right absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none md:right-0 ' +
          (showLang === false ? 'hidden' : '')
        }
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex="-1"
      >
        <div className="py-1" role="none">
          {router.locales.map((locale) => (
            <Link href={router.asPath} locale={locale} key={locale}>
              <span
                className="text-gray-700 block px-4 py-2 text-sm"
                onClick={() => {
                  setShowLang(!showLang);
                  if (setIsNavOpen) setIsNavOpen(false);
                  localStorage.setItem('lang', locale); // For Google login
                }}
              >
                {locale === 'en-US' ? 'English' : '中文'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
