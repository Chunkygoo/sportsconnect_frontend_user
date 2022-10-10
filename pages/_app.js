import '../styles/globals.css';
import Layout from '../components/Layout';
import { Offline } from 'react-detect-offline';
import React, { Fragment, useEffect, useRef, useState } from 'react';
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
import { keepLambdaWarm } from '../network/lib/lambda';
import { signOut } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import { getCurrentUser } from '../network/lib/users';

import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';

if (typeof window !== 'undefined') {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig());
}

function MyApp({ Component, pageProps }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [resDataId, setResDataId] = useState(null);
  const abortControllerRef = useRef(new AbortController());
  const intervalDoubleDomainRef = useRef(null);

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

  // Workaround for two sites sharing cookie /
  useEffect(() => {
    const abortControllerRefCurrent = abortControllerRef.current;
    const helper = async () => {
      if (!intervalDoubleDomainRef.current) {
        intervalDoubleDomainRef.current = setInterval(async () => {
          let res = await getCurrentUser(abortControllerRefCurrent);
          if (res?.status === 200) {
            setResDataId(res?.data.id);
          }
        }, 3000);
      }
    };
    helper();
    return () => {
      abortControllerRefCurrent.abort();
      clearInterval(intervalDoubleDomainRef.current);
    };
  }, []);

  useEffect(() => {
    const helper = async () => {
      if (!currentUserId) {
        setCurrentUserId(resDataId);
      } else if (currentUserId !== resDataId) {
        await signOut();
        setCurrentUserId(null); // after signing out, we need to reset the currentUserId to null
        setResDataId(null); // after signing out, we need to reset the resDataId to null
      }
    };
    helper();
  }, [currentUserId, resDataId]);
  // End workaround for two sites sharing cookie

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
