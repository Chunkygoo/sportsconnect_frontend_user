import useTranslation from 'next-translate/useTranslation';
import React, { Fragment, Suspense } from 'react';
import Template from './Template';

export default function Experiences({ isDisabled }) {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<p>Loading</p>}>
      <Template
        endpoint="/experiences"
        title={t('portfolio:experience')}
        isDisabled={isDisabled}
      />
    </Suspense>
  );
}
