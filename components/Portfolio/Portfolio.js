import Image from 'next/image';
import React, { Fragment, useRef } from 'react';
import Input from './Input';
import Textarea from './Textarea';
import Experiences from './Experiences';
import Educations from './Educations';
import yyyymmdd from '../../utilities/yyyymmdd';
import useTranslation from 'next-translate/useTranslation';
import {
  getCurrentUser,
  updateUser,
  uploadProfilePhoto,
} from '../../network/lib/users';
import YearMonthDayPicker from '../DatePicker/YearMonthDayPicker';
import CropImage from '../CropImage/CropImage';
import Tooltip from './Tooltip';
import { toast } from 'react-toastify';
import Spinner from '../Spinner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reactQueryKeys } from '../../config/reactQueryKeys';
import swal from 'sweetalert';

Date.prototype.yyyymmdd = yyyymmdd;

export default function Portfolio({ _res = null, currentUser }) {
  const { t } = useTranslation();
  const abortControllerRef = useRef(new AbortController());
  let isDisabled = !currentUser;
  const queryClient = useQueryClient();

  const { data } = useQuery(
    [reactQueryKeys.currentUser],
    () => getCurrentUser(abortControllerRef.current),
    {
      onSuccess: ({ status }) => {
        if (status == 404 || status == 422) {
          router.push('/usernotfound');
        }
      },
      onError: () => {
        swal('An error occured').then(
          setTimeout(() => {
            window.location.reload();
          }, 2000)
        );
      },
      enabled: !_res,
    }
  );
  const { data: _currentUser } = data || _res || {};

  const { mutate: updateUserData } = useMutation(
    (userData) => updateUser(userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([reactQueryKeys.currentUser]); // current user contains the photo_url key
      },
      onError: () => {
        swal('An error occured while updating your data').then(
          setTimeout(() => {
            window.location.reload();
          }, 2000)
        );
      },
    }
  );

  const { mutate: uploadProfilePhotoData, isLoading: uploading } = useMutation(
    (photoData) => uploadProfilePhoto(photoData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([reactQueryKeys.currentUser]);
      },
      onError: () => {
        swal('An error occured while uploading your photo').then(
          setTimeout(() => {
            window.location.reload();
          }, 2000)
        );
      },
    }
  );

  if (!_currentUser) {
    return (
      <div className="m-auto">
        <Spinner size={12} />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="container mx-auto my-5 p-5 min-h-[80vh]">
        <div className="md:flex no-wrap mx-2 ">
          <div className="w-full md:w-3/12 sm:mx-2">
            <div className="bg-white border-t-4 border-blue-400 h-full">
              <div className="image overflow-hidden">
                {_currentUser.profile_photo[0] ? (
                  // <img
                  //   className="h-auto w-full mx-auto"
                  //   alt="profile photo"
                  //   src={photoUrl}
                  //   width="600"
                  //   height="600"
                  // />
                  <Image
                    className="h-auto w-full mx-auto"
                    src={_currentUser.profile_photo[0].photo_url}
                    alt=""
                    width={600}
                    height={600}
                    blurDataURL={'/default-photo.jpg'}
                    placeholder="blur"
                  />
                ) : (
                  <Image
                    className="h-auto w-full mx-auto"
                    src="/default-photo.jpg"
                    alt=""
                    width={600}
                    height={600}
                  />
                  // <img
                  //   className="h-auto w-full mx-auto"
                  //   alt="profile photo"
                  //   src="default-photo.jpg"
                  //   width="600"
                  //   height="600"
                  // />
                )}
                {!isDisabled &&
                  (uploading ? (
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin fill-blue-600 mb-2 mx-auto"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : (
                    <div className="text-md grid place-items-center bg-slate-200  text-blue-600">
                      {_currentUser.profile_photo[0] ? (
                        <CropImage
                          display={t('portfolio:upload_new_photo')}
                          uploadProfilePhoto={uploadProfilePhotoData}
                        />
                      ) : (
                        <CropImage
                          display={t('portfolio:change_profile_photo')}
                          uploadProfilePhoto={uploadProfilePhotoData}
                        />
                      )}
                    </div>
                  ))}
              </div>
              {!isDisabled && (
                <div className="flex mt-2 border-b-2 border-gray-300 md:text-xs lg:text-base">
                  <div className="w-full">
                    <Tooltip
                      description={
                        _currentUser.public
                          ? t('portfolio:make_private')
                          : t('portfolio:make_public')
                      }
                      extraInformation={
                        _currentUser.public
                          ? t('portfolio:make_private_description')
                          : t('portfolio:make_public_description')
                      }
                    />
                  </div>
                  <div>
                    {_currentUser.public ? (
                      <svg
                        className="w-6 h-6 md:w-3 md:h-3 lg:w-6 lg:h-6 text-blue-500 hover:text-fuchsia-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() =>
                          updateUserData({
                            public: !_currentUser.public,
                          })
                        }
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 md:w-3 md:h-3 lg:w-6 lg:h-6 text-blue-500 hover:text-fuchsia-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => {
                          toast.success(t('portfolio:made_public'), {
                            position: toast.POSITION.BOTTOM_RIGHT,
                          });
                          updateUserData({
                            public: !_currentUser.public,
                          });
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                    )}
                  </div>
                  {_currentUser.public && (
                    <div>
                      <Tooltip
                        description={
                          <svg
                            className="w-6 h-6 md:w-3 md:h-3 lg:w-6 lg:h-6 my-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/public/${_currentUser.id}`
                              )
                            }
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                          </svg>
                        }
                        initialMessage={t('portfolio:copy')}
                        transitionedMessage={t('portfolio:copied')}
                        hoverColor="text-green-500"
                      />
                    </div>
                  )}
                </div>
              )}
              <h1 className="text-gray-900 leading-8 my-3">
                <Input
                  isDisabled={isDisabled}
                  label={t('portfolio:preferred_name')}
                  name="Preferred name"
                  type="text"
                  value={_currentUser.preferred_name}
                  onChange={(e) =>
                    updateUserData({ preferred_name: e.target.value })
                  }
                />
              </h1>
              <div className="leading-6 w-full h-[20vh] max-h-[10rem] md:h-full md:max-h-[12rem]">
                <Textarea
                  isDisabled={isDisabled}
                  label={t('portfolio:bio')}
                  name="Bio"
                  type="text"
                  value={_currentUser.bio}
                  onChange={(e) => updateUserData({ bio: e.target.value })}
                />
              </div>
            </div>
            <div className="my-4"></div>
          </div>
          <div className="w-full md:w-9/12 sm:mx-2 ">
            <div className="bg-white pb-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-blue-500">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">{t('portfolio:about')}</span>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="md:px-4 py-2">
                    <Input
                      isDisabled={isDisabled}
                      label={t('portfolio:name')}
                      name="Name"
                      type="text"
                      value={_currentUser.name}
                      onChange={(e) => updateUserData({ name: e.target.value })}
                    />
                  </div>
                  <div className="md:px-4 py-2">
                    <Input
                      isDisabled={isDisabled}
                      label={t('portfolio:wechat_id')}
                      name=""
                      type="text"
                      value={_currentUser.wechatId}
                      onChange={(e) =>
                        updateUserData({ wechatId: e.target.value })
                      }
                    />
                  </div>

                  <div className="md:px-4 py-2">
                    <Input
                      isDisabled={isDisabled}
                      label={t('portfolio:gender')}
                      name="Gender"
                      type="text"
                      value={_currentUser.gender}
                      onChange={(e) =>
                        updateUserData({ gender: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:px-4 py-2">
                    <Input
                      isDisabled={isDisabled}
                      label={t('portfolio:contact_no')}
                      name="Contact No."
                      type="text"
                      value={_currentUser.contact_number}
                      onChange={(e) =>
                        updateUserData({ contact_number: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:px-4 py-2">
                    <Input
                      isDisabled={isDisabled}
                      label={t('portfolio:current_address')}
                      name="Current address"
                      type="text"
                      value={_currentUser.current_address}
                      onChange={(e) =>
                        updateUserData({ current_address: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:px-4 py-2 pb-0">
                    <Input
                      isDisabled={isDisabled}
                      label={t('portfolio:permanent_address')}
                      name="Permanent address"
                      type="text"
                      value={_currentUser.permanent_address}
                      onChange={(e) =>
                        updateUserData({ permanent_address: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:px-4 py-2">
                    <Input
                      isDisabled={true}
                      label={t('portfolio:email')}
                      name="Email"
                      type="email"
                      value={_currentUser.email}
                    />
                  </div>

                  <div className="md:px-4 focus:text-black-700">
                    <div className="text-gray-500">
                      {t('portfolio:birthday')}
                    </div>
                    <YearMonthDayPicker
                      isDisabled={isDisabled}
                      selected={
                        _currentUser.birthday
                          ? new Date(_currentUser.birthday)
                          : new Date('2022-07-02T15:00:00Z')
                      }
                      onChange={(date) =>
                        updateUserData({ birthday: date.yyyymmdd() })
                      }
                      className="border-0 border-b-2 w-full border-gray-200 pb-2 focus:outline-none focus:ring-0 focus:border-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="my-4"></div>

            <div className="bg-white shadow-sm rounded-sm">
              <div className="sm:grid sm:grid-cols-2 gap-x-3 px-4">
                <div className="mb-10 sm:mb-0">
                  <Experiences isDisabled={isDisabled} />
                </div>
                <Educations isDisabled={isDisabled} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
