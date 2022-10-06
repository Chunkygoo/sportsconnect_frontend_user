import '../styles/globals.css';
import Layout from '../components/Layout';
import { Offline } from 'react-detect-offline';
import { Fragment, useEffect, useRef } from 'react';
import Modal from '../components/Modal/Modal';
import useTranslation from 'next-translate/useTranslation';
import SuperTokensReact, { SuperTokensWrapper } from 'supertokens-auth-react';
import { frontendConfig } from '../config/frontendConfig';
import MyHead from '../components/Meta/MyHead';
import { useRouter } from 'next/router';
import Session from 'supertokens-auth-react/recipe/session';
import Spinner from '../components/Spinner';
import { ToastContainer } from 'react-toastify';
import { useIdleTimer } from 'react-idle-timer';

import 'react-toastify/dist/ReactToastify.css';
import { keepLambdaWarm } from '../network/lib/lambda';

if (typeof window !== 'undefined') {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig());
}

function MyApp({ Component, pageProps }) {
  const { t } = useTranslation();
  const router = useRouter();

  // Workaround for Lambda warm start
  const intervalIdRef = useRef(null); // we use a ref and not a variable because variables get reassigned (therefore creating another timer) upon rerender
  const startLambdaAndKeepWarm = () => {
    keepLambdaWarm(); // initial warm up
    intervalIdRef.current = setInterval(keepLambdaWarm, 1000 * 60 * 5); // warm up every 5 mins
  };

  const handleOnIdle = () => {
    clearInterval(intervalIdRef.current);
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

  useEffect(() => {
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', 'en-US');
      return;
    }
  }); // run this every time the component rerenders (in case the user clears the localStorage manually, we will not run into an infinite loop)

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

  // for getServerSideProps
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
  return (
    <Fragment>
      <MyHead />
      <SuperTokensWrapper>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SuperTokensWrapper>
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
