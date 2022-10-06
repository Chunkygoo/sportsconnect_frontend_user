import React, { Fragment, useEffect, useRef, useState } from 'react';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import ItemRow from './ItemRow';
import swal from 'sweetalert';
import {
  createEducation,
  getEducations,
  getEducationsForUser,
} from '../../network/lib/education';
import {
  createExperience,
  getExperiences,
  getExperiencesForUser,
} from '../../network/lib/experience';
import Spinner from '../Spinner';
import { useRouter } from 'next/router';

export default function Template({ endpoint, title, isDisabled }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(new AbortController());
  const router = useRouter();
  const userId = router.query.id;
  useEffect(() => {
    let fetchData = async () => {
      let res;
      if (endpoint === '/educations') {
        if (!userId) res = await getEducations(abortControllerRef.current);
        else
          res = await getEducationsForUser(abortControllerRef.current, userId);
      } else {
        if (!userId) res = await getExperiences(abortControllerRef.current);
        else
          res = await getExperiencesForUser(abortControllerRef.current, userId);
      }
      if (res?.status == 200) {
        setData(res?.data);
      } else if (res?.status == 404 || res?.status == 422) {
        router.push('/usernotfound');
      }
    };
    fetchData();
    const abortControllerRefCurrent = abortControllerRef.current;
    return () => {
      abortControllerRefCurrent.abort();
    };
  }, [endpoint, router, userId]);

  let removeDatum = async (index) => {
    let newData = [...data];
    newData.splice(index, 1);
    // make sure key in the list rendered is unique! use id not index
    setData(newData);
  };

  let handleCreate = async () => {
    if (data.length >= 5) {
      swal(
        'Optimize your portfolio',
        'Please only include the 5 most recent items for a good reading experience. Pick the ones you are proud of!'
      );
      return;
    }
    setLoading(true);
    let dummyCreateObject = {
      description: '',
      active: false,
      start_date: '2022-07-16',
      end_date: '2022-07-16',
    };
    let res;
    if (endpoint === '/educations') {
      res = await createEducation(dummyCreateObject);
    } else {
      res = await createExperience(dummyCreateObject);
    }
    if (res.status) {
      setLoading(false);
      setData((data) => [...data, res.data]);
    }
  };

  return (
    <Fragment>
      <div>
        <div className="flex justify-between space-x-2 font-semibold text-gray-900 leading-8 mb-3 mr-4">
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">
              <svg
                className="h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            <div>
              <span className="tracking-wide">
                {/* {capitalizeEndpoint(endpoint)} */}
                {title}
              </span>
            </div>
          </div>
          <span className="float-right pt-1">
            {loading ? (
              <Spinner />
            ) : (
              !isDisabled && (
                <AiOutlinePlusSquare
                  className="h-6 w-6 text-green-400"
                  onClick={handleCreate}
                />
              )
            )}
          </span>
        </div>
        <ul className="list-inside space-y-2">
          {data.map((datum, index) => {
            let startDate = new Date(datum.start_date + 'T15:00:00Z');
            let endDate = new Date(datum.start_date + 'T15:00:00Z');
            if (!datum.active) {
              endDate = new Date(datum.end_date + 'T15:00:00Z');
            }
            return (
              <ItemRow
                key={datum.id}
                index={index}
                removeItem={removeDatum}
                id={datum.id}
                description={datum.description}
                startDate={startDate}
                endDate={endDate}
                active={datum.active}
                endpoint={endpoint}
                isDisabled={isDisabled}
              />
            );
          })}
        </ul>
      </div>
    </Fragment>
  );
}
