import Image from 'next/image';
import React, { Fragment, useEffect, useState } from 'react';
import Input from './Input';
import Textarea from './Textarea';
import Experiences from './Experiences';
import Educations from './Educations';
import yyyymmdd from '../../utilities/yyyymmdd';
import useTranslation from 'next-translate/useTranslation';
import { updateUser, uploadProfilePhoto } from '../../network/lib/users';
import YearMonthDayPicker from '../DatePicker/YearMonthDayPicker';
import CropImage from '../CropImage/CropImage';
import Tooltip from './Tooltip';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

Date.prototype.yyyymmdd = yyyymmdd;

export default function Portfolio({ _res, currentUser }) {
  const { t } = useTranslation();
  const [id, _] = useState(_res.data.id);
  const [name, setName] = useState(_res.data.name);
  const [wechatId, setWechatId] = useState(_res.data.wechatId);
  const [publicProfile, setPublicProfile] = useState(_res.data.public);
  const [preferredName, setPreferredName] = useState(_res.data.preferred_name);
  const [bio, setBio] = useState(_res.data.bio);
  const [gender, setGender] = useState(_res.data.gender);
  const [contact, setContact] = useState(_res.data.contact_number);
  const [currentAddress, setCurrentAddress] = useState(
    _res.data.current_address
  );
  const [permanentAddress, setPermanentAddress] = useState(
    _res.data.permanent_address
  );
  const [email, setEmail] = useState(_res.data.email);
  const [birthday, setBirthday] = useState(
    _res.data.birthday
      ? new Date(_res.data.birthday + 'T15:00:00Z')
      : new Date('2022-07-02T15:00:00Z')
  );
  const [photoUrl, setPhotoUrl] = useState(
    _res.data.profile_photo[0] ? _res.data.profile_photo[0].photo_url : 'None'
  );
  const [uploading, setUploading] = useState(false);
  let isDisabled = !currentUser;

  useEffect(() => {
    let handleUpdate = async () => {
      await updateUser({
        name: name,
        wechatId: wechatId,
        public: publicProfile,
        preferred_name: preferredName,
        bio: bio,
        gender: gender,
        contact_number: contact,
        current_address: currentAddress,
        permanent_address: permanentAddress,
        birthday: birthday?.yyyymmdd(),
      });
    };
    if (!isDisabled) {
      handleUpdate();
    }
  }, [
    name,
    wechatId,
    publicProfile,
    preferredName,
    bio,
    gender,
    contact,
    currentAddress,
    permanentAddress,
    email,
    birthday,
    isDisabled,
  ]);

  return (
    <Fragment>
      <div className="container mx-auto my-5 p-5 min-h-[80vh]">
        <div className="md:flex no-wrap mx-2 ">
          <div className="w-full md:w-3/12 sm:mx-2">
            <div className="bg-white border-t-4 border-blue-400 h-full">
              <div className="image overflow-hidden">
                {photoUrl !== 'None' ? (
                  // <img
                  //   className="h-auto w-full mx-auto"
                  //   alt="profile photo"
                  //   src={photoUrl}
                  //   width="600"
                  //   height="600"
                  // />
                  <Image
                    className="h-auto w-full mx-auto"
                    src={photoUrl}
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
                      {photoUrl === 'None' ? (
                        <CropImage
                          display={t('portfolio:upload_new_photo')}
                          setUploading={setUploading}
                          setPhotoUrl={setPhotoUrl}
                          uploadProfilePhoto={uploadProfilePhoto}
                        />
                      ) : (
                        <CropImage
                          display={t('portfolio:change_profile_photo')}
                          setUploading={setUploading}
                          setPhotoUrl={setPhotoUrl}
                          uploadProfilePhoto={uploadProfilePhoto}
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
                        publicProfile
                          ? t('portfolio:make_private')
                          : t('portfolio:make_public')
                      }
                      extraInformation={
                        publicProfile
                          ? t('portfolio:make_private_description')
                          : t('portfolio:make_public_description')
                      }
                    />
                  </div>
                  <div>
                    {publicProfile ? (
                      <svg
                        className="w-6 h-6 md:w-3 md:h-3 lg:w-6 lg:h-6 text-blue-500 hover:text-fuchsia-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => setPublicProfile(!publicProfile)}
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
                          setPublicProfile(!publicProfile);
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
                  {publicProfile && (
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
                                `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/public/${id}`
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
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                />
              </h1>
              <div className="leading-6 w-full h-[20vh] max-h-[10rem] md:h-full md:max-h-[12rem]">
                <Textarea
                  isDisabled={isDisabled}
                  label={t('portfolio:bio')}
                  name="Bio"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="md:px-4 py-2">
                    <Input
                      isDisabled={isDisabled}
                      label={t('portfolio:wechat_id')}
                      name=""
                      type="text"
                      value={wechatId}
                      onChange={(e) => setWechatId(e.target.value)}
                    />
                  </div>

                  <div className="md:px-4 py-2">
                    <Input
                      isDisabled={isDisabled}
                      label={t('portfolio:gender')}
                      name="Gender"
                      type="text"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    />
                  </div>
                  <div className="md:px-4 py-2">
                    <Input
                      isDisabled={isDisabled}
                      label={t('portfolio:contact_no')}
                      name="Contact No."
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                  <div className="md:px-4 py-2">
                    <Input
                      isDisabled={isDisabled}
                      label={t('portfolio:current_address')}
                      name="Current address"
                      type="text"
                      value={currentAddress}
                      onChange={(e) => setCurrentAddress(e.target.value)}
                    />
                  </div>
                  <div className="md:px-4 py-2 pb-0">
                    <Input
                      isDisabled={isDisabled}
                      label={t('portfolio:permanent_address')}
                      name="Permanent address"
                      type="text"
                      value={permanentAddress}
                      onChange={(e) => setPermanentAddress(e.target.value)}
                    />
                  </div>
                  <div className="md:px-4 py-2">
                    <Input
                      isDisabled={true}
                      label={t('portfolio:email')}
                      name="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="md:px-4 focus:text-black-700">
                    <div className="text-gray-500">
                      {t('portfolio:birthday')}
                    </div>
                    <YearMonthDayPicker
                      isDisabled={isDisabled}
                      selected={birthday}
                      onChange={(date) => {
                        setBirthday(date);
                      }}
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
      <ToastContainer />
    </Fragment>
  );
}
