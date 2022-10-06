import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import UniversityDropdown from '../Universities/UniversityDropdown';
import LanguageDropdown from './LanguageDropdown';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

export default function HeaderNavLarge({ loggingOut, handleLogout }) {
  const { t } = useTranslation();
  const session = useSessionContext();
  const router = useRouter();
  const urlPath = router.asPath;
  const { doesSessionExist } = session;
  return (
    <ul className="DESKTOP-MENU space-x-8 hidden lg:flex">
      <li>
        <Link href="/home">
          <a
            className={
              'block py-2 pr-4 pl-3 text-gray-700 rounded lg:bg-transparent lg:p-0 hover:border-b hover:border-gray-800 hover:text-blue-700 ' +
              (urlPath.includes('/home')
                ? 'border-b border-gray-800 text-blue-700'
                : '')
            }
            aria-current="page"
          >
            {t('header:home')}
          </a>
        </Link>
      </li>
      <li>
        <UniversityDropdown />
      </li>
      <li>
        <Link href="/steps">
          <a
            className={
              'block py-2 pr-4 pl-3 text-gray-700 rounded lg:bg-transparent lg:p-0 hover:border-b hover:border-gray-800 hover:text-blue-700 ' +
              (urlPath.includes('/steps')
                ? 'border-b border-gray-800 text-blue-700'
                : '')
            }
            aria-current="page"
          >
            {t('header:steps')}
          </a>
        </Link>
      </li>
      <li>
        <Link href="/portfolio">
          <a
            className={
              'block py-2 pr-4 pl-3 text-gray-700 rounded lg:bg-transparent lg:p-0 hover:border-b hover:border-gray-800 hover:text-blue-700 ' +
              (urlPath.includes('/portfolio')
                ? 'border-b border-gray-800 text-blue-700'
                : '')
            }
            aria-current="page"
          >
            {' '}
            {t('header:portfolio')}
          </a>
        </Link>
      </li>
      {!doesSessionExist ? (
        <Fragment>
          <li>
            <Link href="/auth/loginsignup">
              <a
                className={
                  'block py-2 pr-4 pl-3 text-gray-700 rounded lg:bg-transparent lg:p-0 hover:border-b hover:border-gray-800 hover:text-blue-700 ' +
                  (urlPath.includes('/auth/loginsignup')
                    ? 'border-b border-gray-800 text-blue-700'
                    : '')
                }
                aria-current="page"
              >
                {' '}
                {t('header:login_signup')}
              </a>
            </Link>
          </li>
        </Fragment>
      ) : (
        <li>
          <button
            disabled={loggingOut}
            onClick={handleLogout}
            className="block py-2 pr-4 pl-3 text-gray-700 rounded lg:bg-transparent lg:p-0 hover:border-b hover:border-gray-800 hover:text-blue-700"
          >
            {t('header:log_out')}
          </button>
        </li>
      )}

      <li>
        <LanguageDropdown />
      </li>
    </ul>
  );
}
