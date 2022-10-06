import React from 'react';
import UniversitiesGallery from '../components/Universities/UniversitiesGallery';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import myAxiosPrivate from '../network/myAxiosPrivate';
import { getPublicUniversities } from '../network/lib/universities';

export default function universities({ _res }) {
  return (
    <div className="mx-auto max-w-screen-xl max-h-screen-xl min-h-[80vh]">
      <UniversitiesGallery _res={_res} />
    </div>
  );
}

export async function getServerSideProps(context) {
  if (context.req.cookies.sAccessToken) {
    let cookieString = '';
    for (var key of Object.keys(context.req.cookies)) {
      cookieString += key + '=' + context.req.cookies[key] + '; ';
    }
    try {
      let myAxios = await myAxiosPrivate();
      var res = await myAxios
        .get(`/universities?limit=-1`, {
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
  } else {
    let res = await getPublicUniversities(-1);
    return {
      props: {
        _res: { data: res.data, status: res.status },
      },
    };
  }
}
