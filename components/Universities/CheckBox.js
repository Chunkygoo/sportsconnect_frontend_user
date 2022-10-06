import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { useState, memo } from 'react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import {
  expressInterestInUni,
  removeInterestInUni,
} from '../../network/lib/users';

export default memo(function CheckBox({
  interested,
  uniId,
  index,
  updateTickedUni,
  category,
  prev,
  isPrev,
}) {
  let session = useSessionContext();
  let { doesSessionExist } = session;
  const router = useRouter();
  const [isInterested, setIsInterested] = useState(interested);
  const { t } = useTranslation();
  let handleOnChange = async (uniId) => {
    if (isInterested) {
      await removeInterestInUni(uniId);
    } else {
      await expressInterestInUni(uniId);
    }
  };

  let interestedBody = isInterested
    ? t('universities:remove_from_interested')
    : t('universities:add_to_interested');
  let bodyClassNames = isInterested
    ? 'text-red-100 bg-red-500 hover:bg-red-600 hover:text-red-200'
    : 'text-blue-100 bg-blue-500 hover:bg-blue-600 hover:text-blue-200';
  let body;
  if (isPrev) {
    body = (
      <>
        {interestedBody} {category === 'Men' ? '(M)' : '(W)'}
      </>
    );
  } else {
    body = (
      <>
        {interestedBody} {prev && (prev.category === 'Men' ? '(W)' : '(M)')}
      </>
    );
  }

  return (
    <span
      className={'p-1 rounded ' + bodyClassNames}
      onClick={() => {
        if (doesSessionExist) {
          setIsInterested(!isInterested);
          updateTickedUni(isInterested, index);
          handleOnChange(uniId);
        } else {
          router.push('/auth/loginsignup');
        }
      }}
    >
      <span className="text-white mr-2 pl-2">{body}</span>
    </span>
  );
});
