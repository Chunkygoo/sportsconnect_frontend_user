import React from 'react';
import dynamic from 'next/dynamic';
import { ResetPasswordUsingToken } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';

const ResetPasswordUsingTokenNoSSR = dynamic(
  new Promise((res) => res(ResetPasswordUsingToken)),
  {
    ssr: false,
  }
);

export default function resetpassword() {
  return (
    <div className="flex min-h-[80vh]">
      <div className="m-auto">
        <ResetPasswordUsingTokenNoSSR />
      </div>
    </div>
  );
}
