import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import SuperTokens from 'supertokens-auth-react';
import { useRouter } from 'next/router';

const SuperTokensComponentNoSSR = dynamic(
  new Promise((res) => res(SuperTokens.getRoutingComponent)),
  { ssr: false }
);

export default function Auth() {
  const router = useRouter();
  // if the user visits a page that is not handled by us
  // (like /auth/asdjklnogjk), then we redirect them back to the /auth/loginsignup page.
  useEffect(() => {
    if (SuperTokens.canHandleRoute() === false) {
      router.push('/auth/loginsignup');
    }
  }, [router]);

  return (
    <div className="flex h-[75vh]">
      <div className="m-auto">
        <SuperTokensComponentNoSSR />
      </div>
    </div>
  );
}
