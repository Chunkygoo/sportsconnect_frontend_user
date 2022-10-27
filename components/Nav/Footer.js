import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="p-4 bg-gray-50 sm:p-6">
      <div className="mx-auto max-w-screen-xl">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              {/* <img
                className="mr-3 h-6 sm:h-9"
                alt="Logo"
                src="/logo.png"
                width="40"
                height="40"
              /> */}
              <Image
                width={40}
                height={40}
                src="/logo.png"
                className="mr-3 h-6 sm:h-9"
                alt="Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap ml-4">
                SportsConnect
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                {t('footer:about')}
              </h2>
              <ul className="text-gray-600">
                <li className="mb-4">
                  <Link href="/contactus">
                    <span className="hover:underline">
                      {t('footer:contact_us')}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/team">
                    <span className="hover:underline">{t('footer:team')}</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                {t('footer:follow_us')}
              </h2>
              <ul className="text-gray-600">
                <li className="mb-4">
                  <span
                    href="https://www.instagram.com/sportsconnect_official/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline "
                  >
                    {t('footer:instagram')}
                  </span>
                </li>
                <li>
                  <span
                    href="https://www.linkedin.com/company/sportsconnecthq/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {t('footer:linkedin')}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © 2022 SportsConnect.com. {t('footer:all_rights_reserved')}.
          </span>
        </div>
      </div>
    </footer>
  );
}
