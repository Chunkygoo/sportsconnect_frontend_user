import React from 'react';
import UniversitiesGallery from '../components/Universities/UniversitiesGallery';
import { getPublicUniversities } from '../network/lib/universities';

export default function universities({ _res }) {
  return (
    <div className="mx-auto max-w-screen-xl max-h-screen-xl min-h-[80vh]">
      <UniversitiesGallery _res={_res} />
    </div>
  );
}

export async function getStaticProps() {
  try {
    let res = await getPublicUniversities(9);
    return {
      props: {
        _res: { data: res.data, status: res.status },
      },
    };
  } catch (error) {
    return {
      props: {
        _res: { data: [], status: 200 },
      },
    };
  }
}
