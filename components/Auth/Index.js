import React from 'react';
import Image from 'next/image';
import { SignInAndUp } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import useTranslation from 'next-translate/useTranslation';

export default function Index() {
  const { t } = useTranslation();
  return (
    <div className="dark:bg-white mx-auto">
      <div className="flex justify-center min-h-[100vh]">
        <div className="relative hidden bg-cover lg:block lg:w-[60%] xl:w-2/3">
          {/* <Image
            src="/computer.jpg"
            className="object-center object-cover pointer-events-none"
            alt="Computer image"
            fill={true}
            priority={true}
          /> */}
          <Image
            src={'/computer.jpg'}
            className="object-center object-cover pointer-events-none"
            alt="Computer image"
            priority={true}
            blurDataURL={'/computer_blurred.png'}
            placeholder="blur"
            fill={true}
          />
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40 relative z-1">
            <div>
              <h2 className="text-4xl font-bold text-white">SportsConnect</h2>
              <p className="max-w-xl mt-3 text-gray-300">
                {t('login:image_description')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center w-full max-w-md px-3 mx-auto lg:w-[40%] xl:w-2/6">
          <div className="text-center mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-700">
              SportsConnect
            </h2>
            <SignInAndUp />
          </div>
        </div>
      </div>
    </div>
  );
}
