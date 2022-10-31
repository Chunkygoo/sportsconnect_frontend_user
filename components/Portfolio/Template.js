import React, { Fragment, useRef, useState } from 'react';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import ItemRow from './ItemRow';
import swal from 'sweetalert';
import {
  createEducation,
  deleteEducation,
  getEducations,
  getEducationsForUser,
  updateEducation,
} from '../../network/lib/education';
import {
  createExperience,
  deleteExperience,
  getExperiences,
  getExperiencesForUser,
  updateExperience,
} from '../../network/lib/experience';
import Spinner from '../Spinner';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reactQueryKeys } from '../../config/reactQueryKeys';
import { toast } from 'react-toastify';
import yyyymmdd from '../../utilities/yyyymmdd';

Date.prototype.yyyymmdd = yyyymmdd;

export default function Template({ endpoint, title, isDisabled }) {
  const abortControllerRef = useRef(new AbortController());
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = router.query.id;

  const getItems = endpoint === '/educations' ? getEducations : getExperiences;
  const getItemsForUser =
    endpoint === '/educations' ? getEducationsForUser : getExperiencesForUser;
  const createItem =
    endpoint === '/educations' ? createEducation : createExperience;
  const updateItem =
    endpoint === '/educations' ? updateEducation : updateExperience;
  const deleteItem =
    endpoint === '/educations' ? deleteEducation : deleteExperience;
  const reactQueryKey =
    endpoint === '/educations'
      ? reactQueryKeys.educations
      : reactQueryKeys.experiences;

  const { data: userData, isLoading } = useQuery(
    [reactQueryKey],
    () => getItems(abortControllerRef.current),
    {
      onSuccess: ({ data, status }) => {
        if (status === 200) {
          setData(data.reduce((a, v) => ({ ...a, [v.id]: v }), {}));
        } else if (status == 404 || status == 422) {
          router.push('/usernotfound');
        }
      },
      onError: () => {
        toast.error('An error occured while getting your data', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
      enabled: !isDisabled,
    }
  );

  const { data: publicUserData, isLoading: isLoadingForUser } = useQuery(
    [reactQueryKey],
    () => getItemsForUser(abortControllerRef.current, userId),
    {
      onSuccess: ({ data, status }) => {
        if (status === 200) {
          setData(data.reduce((a, v) => ({ ...a, [v.id]: v }), {}));
        } else if (status == 404 || status == 422) {
          router.push('/usernotfound');
        }
      },
      onError: () => {
        toast.error('An error occured while getting your data', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
      enabled: isDisabled,
    }
  );
  const [data, setData] = useState(
    userData?.data.reduce((a, v) => ({ ...a, [v.id]: v }), {}) ||
      publicUserData?.data.reduce((a, v) => ({ ...a, [v.id]: v }), {}) ||
      {}
  ); // use object instead of array to prevent random ordering

  let createItemMutationFunction = async (dummyCreateObject) => {
    if (Object.keys(data).length >= 5) {
      swal(
        'Optimize your portfolio',
        'Please only include the 5 most recent items for a good reading experience. Pick the ones you are proud of!'
      );
      return;
    }
    try {
      let res = await createItem(dummyCreateObject);
      if (res.status === 201) {
        // because creating Item requires us to use the id it returns, we can't do OU
        setData((prevData) => {
          const newData = { ...prevData };
          newData[res.id] = dummyCreateObject;
          return newData;
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const { mutate: handleCreate, isLoading: isCreateLoading } = useMutation(
    (dummyCreateObject) => createItemMutationFunction(dummyCreateObject),
    {
      onError: () => {
        toast.error('An error occured while creating a new item', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
      // Always refetch after error or success - sync the cache no matter what
      onSettled: () => {
        queryClient.invalidateQueries([reactQueryKey]);
      },
    }
  );

  let updateItemMutationFunction = async (_itemData) => {
    let updateObject = {
      description: _itemData.description,
      active: _itemData.active,
      start_date: _itemData.startDate.yyyymmdd(),
      end_date:
        _itemData.endDate !== undefined ? _itemData.endDate.yyyymmdd() : null,
    };
    try {
      await updateItem(_itemData.id, updateObject);
    } catch (error) {
      throw new Error(error);
    }
  };

  const { mutate: handleUpdate } = useMutation(
    (itemData) => updateItemMutationFunction(itemData),
    {
      onMutate: async (newItemData) => {
        // Cancel any outgoing updates (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries([reactQueryKey]);
        const previousData = queryClient.getQueryData([reactQueryKey]);
        // Optimistic update
        setData((prevData) => {
          const newData = { ...prevData };
          newItemData.start_date = newItemData.startDate.yyyymmdd();
          newItemData.end_date = newItemData.endDate.yyyymmdd();
          newData[newItemData.id] = newItemData;
          return newData;
        });
        return { previousData };
      },
      onError: (_, __, context) => {
        queryClient.setQueryData([reactQueryKey], context.previousData);
        toast.error('An error occured while updating your data', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
      // Always refetch after error or success - sync the cache no matter what
      onSettled: () => {
        queryClient.invalidateQueries([reactQueryKey]);
      },
    }
  );

  const { mutate: handleDelete } = useMutation((id) => deleteItem(id), {
    onMutate: async (id) => {
      // Cancel any outgoing updates (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries([reactQueryKey]);
      const previousData = queryClient.getQueryData([reactQueryKey]);
      // Optimistic update
      setData((prevData) => {
        const newData = { ...prevData };
        delete newData[id];
        return newData;
      });
      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData([reactQueryKey], context.previousData);
      toast.error('An error occured while deleting your data', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },
    // Always refetch after error or success - sync the cache no matter what
    onSettled: () => {
      queryClient.invalidateQueries([reactQueryKey]);
    },
  });

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
              <span className="tracking-wide">{title}</span>
            </div>
          </div>
          <span className="float-right pt-1">
            {isCreateLoading ? (
              <Spinner />
            ) : (
              !isDisabled && (
                <AiOutlinePlusSquare
                  className="h-6 w-6 text-green-400"
                  onClick={() => {
                    handleCreate({
                      description: '',
                      active: false,
                      start_date: '2022-07-16',
                      end_date: '2022-07-16',
                    });
                  }}
                />
              )
            )}
          </span>
        </div>
        <ul className="list-inside space-y-2">
          {isLoading || isLoadingForUser ? (
            <div
              role="status"
              className="text-blue-600 max-w-[100%] animate-pulse"
            >
              <div className="mb-4">
                <div className="pt-2 h-2.5 mb-1 bg-gray-200 rounded-full dark:bg-gray-700 w-[95%] px-0 mt-0 border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"></div>
                <div className="pt-2 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-[90%] px-0 mt-0 border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"></div>
              </div>
              <div className="mb-4">
                <div className="pt-2 h-2.5 mb-1 bg-gray-200 rounded-full dark:bg-gray-700 w-[97%] px-0 mt-0 border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"></div>
                <div className="pt-2 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-[80%] px-0 mt-0 border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"></div>
              </div>
              <div className="mb-4">
                <div className="pt-2 h-2.5 mb-1 bg-gray-200 rounded-full dark:bg-gray-700 w-[80%] px-0 mt-0 border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"></div>
                <div className="pt-2 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-[85%] px-0 mt-0 border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"></div>
              </div>
            </div>
          ) : (
            Object.keys(data)
              .map((key) => data[key])
              .map((datum) => {
                const startDate = new Date(datum.start_date + 'T15:00:00Z');
                const endDate = datum.active
                  ? new Date(datum.start_date + 'T15:00:00Z')
                  : (endDate = new Date(datum.end_date + 'T15:00:00Z'));
                const itemRowObject = {
                  id: datum.id,
                  active: datum.active,
                  description: datum.description,
                  startDate: startDate,
                  endDate: endDate,
                };
                return (
                  <ItemRow
                    key={datum.id}
                    endpoint={endpoint}
                    isDisabled={isDisabled}
                    isCreateLoading={isCreateLoading}
                    itemRowObject={itemRowObject}
                    reactQueryKey={reactQueryKey}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                  />
                );
              })
          )}
        </ul>
      </div>
    </Fragment>
  );
}
