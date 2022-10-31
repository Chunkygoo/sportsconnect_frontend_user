import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { memo } from 'react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import {
  expressInterestInUni,
  removeInterestInUni,
} from '../../network/lib/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reactQueryKeys } from '../../config/reactQueryKeys';
import { toast } from 'react-toastify';

export default memo(function CheckBox({
  interested,
  uniId,
  index,
  setAllUnis,
  category,
  prev,
  isPrev,
  mine,
}) {
  let session = useSessionContext();
  let { doesSessionExist } = session;
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const alterInterestMutationFunction = interested
    ? async (id) => {
        return await removeInterestInUni(id);
      }
    : async (id) => {
        return await expressInterestInUni(id);
      };
  const { mutate: updateInterestInUni } = useMutation(
    (_uniId) => alterInterestMutationFunction(_uniId),
    {
      onMutate: async (_uniId) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries([reactQueryKeys.universities, mine]);
        const previousUniData = queryClient.getQueryData([
          reactQueryKeys.currentUser,
        ]);
        // Optimistic update
        setAllUnis((prevAllUnis) => {
          let newAllUnis = [...prevAllUnis];
          newAllUnis[index] = {
            ...prevAllUnis[index],
            interested: !interested,
          };
          return newAllUnis;
        });
        return { previousUniData };
      },
      onError: (_, __, context) => {
        queryClient.setQueryData(
          [reactQueryKeys.universities, mine],
          context.previousUniData
        );
        toast.error('An error occured while updating your data', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
      // Always refetch after error or success - sync the cache no matter what
      onSettled: () => {
        queryClient.invalidateQueries([reactQueryKeys.universities, mine]);
      },
    }
  );

  let interestedBody = interested
    ? t('universities:remove_from_interested')
    : t('universities:add_to_interested');
  let bodyClassNames = interested
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
          updateInterestInUni(uniId);
        } else {
          router.push('/auth/loginsignup');
        }
      }}
    >
      <span className="text-white mr-2 pl-2">{body}</span>
    </span>
  );
});
