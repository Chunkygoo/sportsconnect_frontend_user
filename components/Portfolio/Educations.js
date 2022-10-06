import useTranslation from 'next-translate/useTranslation';
import React, { Fragment } from 'react';
import Template from './Template';

export default function Educations({ isDisabled }) {
  const { t } = useTranslation();
  return (
    <Fragment>
      <Template
        endpoint={'/educations'}
        title={t('portfolio:educations')}
        isDisabled={isDisabled}
      />
    </Fragment>
  );
}
