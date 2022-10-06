import React from 'react';
import Portfolio from '../../components/Portfolio/Portfolio';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import myAxiosPrivate from '../../network/myAxiosPrivate';

export default function portfolio({ _res }) {
  return (
    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl min-h-[80vh]">
      <SessionAuth>
        <Portfolio _res={_res} currentUser={true} />
      </SessionAuth>
    </div>
  );
}

export async function getServerSideProps(context) {
  let cookieString = '';
  for (var key of Object.keys(context.req.cookies)) {
    cookieString += key + '=' + context.req.cookies[key] + '; ';
  }
  try {
    let myAxios = await myAxiosPrivate();
    var res = await myAxios
      .get(`/users/me`, {
        headers: {
          Cookie: cookieString,
        },
      })
      .catch((e) => {
        return e.response;
      });
    if (res.status === 401) {
      return { props: { fromSupertokens: 'needs-refresh' } };
    }
    return {
      props: {
        _res: { data: res.data, status: res.status },
      },
    };
  } catch (error) {
    console.log(error);
  }
}
