import '../styles/globals.css';
import Layout from '../components/Layout';
import { Offline } from 'react-detect-offline';
import React, { Fragment, useCallback, useEffect, useRef } from 'react';
import Modal from '../components/Modal/Modal';
import useTranslation from 'next-translate/useTranslation';
import SuperTokensReact, { SuperTokensWrapper } from 'supertokens-auth-react';
import { frontendConfig } from '../config/frontendConfig';
import MyHead from '../components/Meta/MyHead';
import { useRouter } from 'next/router';
import Session from 'supertokens-auth-react/recipe/session';
import Spinner from '../components/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import { useIdleTimer } from 'react-idle-timer';
import { keepLambdaWarm } from '../network/lib/lambda';
import { signOut } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient(); // needs to be in the global scope

if (typeof window !== 'undefined') {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig());
}

function MyApp({ Component, pageProps, ...appProps }) {
  const { t } = useTranslation();
  const router = useRouter();

  // Workaround for Lambda warm start (probably dont need this since we are executing getCurrentUser every 3 seconds)
  const intervalRef = useRef(null); // we use a ref and not a variable because variables get reassigned (therefore creating another timer) upon rerender
  const startLambdaAndKeepWarm = () => {
    keepLambdaWarm(); // initial warm up
    intervalRef.current = setInterval(keepLambdaWarm, 1000 * 60 * 5); // warm up every 5 mins
  };

  const handleOnIdle = () => {
    clearInterval(intervalRef.current);
  };

  useIdleTimer({
    timeout: 1000 * 60, // User is considered idle after 1 minute of inactivity
    onIdle: handleOnIdle,
    onActive: startLambdaAndKeepWarm,
  });

  useEffect(() => {
    startLambdaAndKeepWarm();
  }, []);
  // End workaround for Lambda warm start

  // workaround for Google login issues
  useEffect(() => {
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', 'en-US');
      return;
    }
  }); // run this every time the component rerenders (in case the user clears the localStorage manually, we will not run into an infinite loop)
  // End workaround for Google login issues

  const logOutHelper = useCallback(async () => {
    await signOut();
    toast.success(t('header:logged_out'), {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    router.push('/home');
  }, [router, t]);

  useEffect(() => {
    switch (router.locale) {
      case 'en-US':
        SuperTokensReact.changeLanguage('en');
        break;
      case 'zh':
        SuperTokensReact.changeLanguage('zh');
        break;
      default:
        SuperTokensReact.changeLanguage('en');
    }
  }, [router.locale]);

  // for SuperTokens getServerSideProps
  useEffect(() => {
    let refresh = async () => {
      if (pageProps.fromSupertokens === 'needs-refresh') {
        if (await Session.attemptRefreshingSession()) {
          router.replace(router.asPath);
        } else {
          router.push('/auth/loginsignup');
        }
      }
    };
    refresh();
  }, [pageProps.fromSupertokens, router]);
  // End for SuperTokens getServerSideProps

  if (pageProps.fromSupertokens === 'needs-refresh') {
    return (
      <div className="flex h-screen">
        <div className="m-auto">
          <Spinner size={12} />
        </div>
      </div>
    );
  }
  let offlineTitle = t('offline:offline_title');
  let offlineDescription = t('offline:offline_description');

  if ([`/auth/[[...path]]`].includes(appProps.router.pathname)) {
    // for Google login
    return <Component {...pageProps} />;
  }

  return (
    <Fragment>
      <MyHead />
      <QueryClientProvider client={queryClient}>
        <SuperTokensWrapper>
          <Layout logOutHelper={logOutHelper}>
            <Component {...pageProps} />
          </Layout>
        </SuperTokensWrapper>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Offline>
        <Modal
          initialShow={true}
          title={offlineTitle}
          description={offlineDescription}
        />
      </Offline>
      <ToastContainer />
    </Fragment>
  );
}

export default MyApp;
