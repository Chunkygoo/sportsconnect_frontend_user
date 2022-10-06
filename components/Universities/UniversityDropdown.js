import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import listenForOutsideClick from '../../utilities/listenForOutsideClick';

export default function UniversityDropdown({ navSmall, setIsNavOpen }) {
  const [showUni, setShowUni] = useState(false);
  const { t } = useTranslation();
  let uniRoutes = ['/universities', '/myuniversities'];
  const router = useRouter();
  const urlPath = router.asPath;
  const divRef = useRef(null);
  const [listening, setListening] = useState(false);
  useEffect(() => {
    listenForOutsideClick(listening, setListening, divRef, () => {
      setShowUni(false);
    })();
  }, [listening]);
  return (
    <div ref={divRef} className="inline-block text-left relative">
      <div>
        <span
          className={
            'text-gray-700 rounded lg:bg-transparent lg:p-0focus:outline-0 ' +
            (navSmall
              ? 'border-b border-gray-400 text-xl uppercase hover:bg-gray-200 '
              : '') +
            (urlPath.includes('universities')
              ? 'border-b border-gray-800 text-blue-700'
              : '')
          }
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setShowUni(!showUni)}
        >
          {urlPath === '/universities'
            ? t('header:all_universities')
            : t('header:my_universities')}
        </span>
      </div>
      {showUni && (
        <div
          className={
            'origin-top-right absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none md:right-0 ' +
            (showUni === false ? 'hidden' : '')
          }
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            {uniRoutes.map((uniRoute, index) => (
              <Link href={uniRoute} key={index}>
                <a
                  className="text-gray-700 block px-4 py-2 text-sm"
                  onClick={() => {
                    setShowUni(!showUni);
                    if (setIsNavOpen) setIsNavOpen(false);
                  }}
                >
                  {uniRoute === '/universities'
                    ? t('header:all_universities')
                    : t('header:my_universities')}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
