import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react';
import { signOut } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import { toast } from 'react-toastify';

import HeaderNavLarge from './HeaderNavLarge';
import HeaderNavSmall from './HeaderNavSmall';
import Home from './Home';

import useTranslation from 'next-translate/useTranslation';

export default function Header({ logOutHelper }) {
  const [loggingOut, setLoggingOut] = useState(false);
  let handleLogout = async () => {
    setLoggingOut(true);
    await logOutHelper();
    setLoggingOut(false);
  };
  return (
    <Fragment>
      <header className="sticky top-0 z-50">
        <nav className="border-gray-200 px-4 lg:px-6 py-2.5 bg-blue-50">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <Home />
            <div>
              <nav>
                <HeaderNavSmall
                  loggingOut={loggingOut}
                  handleLogout={handleLogout}
                />
                <HeaderNavLarge
                  loggingOut={loggingOut}
                  handleLogout={handleLogout}
                />
              </nav>
            </div>
          </div>
        </nav>
      </header>
    </Fragment>
  );
}
