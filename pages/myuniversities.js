import React from 'react';
import UniversitiesGallery from '../components/Universities/UniversitiesGallery';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';

export default function myuniversities() {
  return (
    <div className="mx-auto max-w-screen-xl max-h-screen-xl min-h-[80vh]">
      <SessionAuth>
        <UniversitiesGallery />
      </SessionAuth>
    </div>
  );
}

// export async function getServerSideProps(context) {
//   let cookieString = '';
//   for (var key of Object.keys(context.req.cookies)) {
//     cookieString += key + '=' + context.req.cookies[key] + '; ';
//   }
//   try {
//     let myAxios = await myAxiosPrivate();
//     var res = await myAxios
//       .get(`/universities/interested_only?limit=-1`, {
//         headers: {
//           Cookie: cookieString,
//         },
//       })
//       .catch((e) => {
//         throw new Error(e);
//       });
//     if (res.status === 401) {
//       return { props: { fromSupertokens: 'needs-refresh' } };
//     }
//     return {
//       props: {
//         _res: { data: res.data, status: res.status },
//       },
//     };
//   } catch (error) {
//     if (error.message !== 'CanceledError: canceled') {
//       throw new Error(e);
//     }
//   }
// }
