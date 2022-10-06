import React, { Fragment } from 'react';
import Portfolio from '../../../components/Portfolio/Portfolio';
import { getUser } from '../../../network/lib/users';

export default function publicPortfolio({ _res }) {
  return (
    <Fragment>
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl min-h-[80vh]">
        <Portfolio _res={_res} />
      </div>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const userId = params.id;
  let res = await getUser(null, userId);
  if (res.data.detail === 'The user does not exist') {
    return {
      redirect: {
        destination: '/usernotfound',
      },
    };
  }
  return {
    props: {
      _res: { data: res.data, status: res.status },
    },
  };
}
