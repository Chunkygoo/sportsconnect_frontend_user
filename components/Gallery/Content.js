import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import React from 'react';
import CheckBox from '../Universities/CheckBox';
import IconCross from './../Icons/IconCross';

const Content = ({ uni, onClose, setAllUnis, mine }) => {
  const { t } = useTranslation();
  const checkBox = (
    <CheckBox
      interested={uni.interested}
      uniId={uni.id}
      index={uni.index}
      setAllUnis={setAllUnis}
      mine={mine}
      category={uni.category}
      prev={uni.prev}
      isPrev={false}
    />
  );
  if (uni.prev) {
    // var for more scope
    var prevCheckBox = (
      <CheckBox
        interested={uni.prev.interested}
        uniId={uni.prev.id}
        index={uni.prev.index}
        setAllUnis={setAllUnis}
        mine={mine}
        category={uni.prev.category}
        isPrev={true}
      />
    );
  }
  return (
    <>
      <div>
        <div className="rounded-l-xl absolute top-0 bottom-0 left-0 bg-slate-900 w-[30%] z-[2] before:absolute before:z-10 before:bg-gradient-to-r from-slate-900 to-transparent before:top-0 before:bottom-0 before:left-full before:w-60" />
        <div className="absolute top-0 bottom-0 right-0 w-[70%] bg-repeat-round z-[1] rounded-r-xl">
          {/* <ProgressiveImg
            src={uni.backgroundImage}
            placeholderSrc={uni.blurredBackgroundImage}
            className="bg-repeat-round rounded-r-xl h-full w-full"
            alt="University image"
          /> */}
          <Image
            src={uni.backgroundImage}
            className="bg-repeat-round rounded-r-xl"
            alt="University image"
            layout="fill"
            blurDataURL={uni.blurredBackgroundImage}
            placeholder="blur"
          />
        </div>
        {/* w-[20%] h-[25%] sm:w-[16%] sm:h-[30%] lg:w-[14%] lg:h-[30%] xl:w-[10%] xl:h-[30%] */}
        <span className="absolute bottom-0 right-0 sm:left-0 w-12 h-12 sm:w-24 sm:h-24 z-[2] m-4">
          {/* <ProgressiveImg
            placeholderSrc={uni.blurredLogo}
            src={uni.logo}
            className="h-full w-full"
            alt="University image"
          /> */}
          <Image
            src={uni.logo}
            alt="University logo"
            layout="fill"
            blurDataURL={uni.blurredLogo}
            placeholder="blur"
          />
        </span>
      </div>
      <div className="text-sm md:text-lg absolute top-0 bottom-0 left-0 right-0 h-full z-[3]">
        <div className="px-4 py-4 lg:py-10 text-[#f5deb3] w-[70%]">
          <a href={uni.link} target="_blank" rel="noreferrer">
            <div className="flex text-[#fff] hover:text-blue-500 mb-6">
              <h1 className="font-[45px] font-bold ">
                {uni.name.substring(uni.name.indexOf(')') + 2)}
              </h1>
              <svg
                className="w-4 h-4 md:w-6 md:h-6 my-auto ml-1"
                data-darkreader-inline-stroke=""
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
            </div>
          </a>
          <div className="text-[#d4d3d3] font-[18px] mt-2 max-w-xs sm:max-w-sm md:max-w-md">
            <span className="text-white">{t('universities:category')}:</span>{' '}
            {uni.category}
          </div>
          <div className="text-[#d4d3d3] font-[18px] mt-2 max-w-xs sm:max-w-sm md:max-w-md">
            <span className="text-white">{t('universities:conference')}:</span>{' '}
            {uni.conference}
          </div>
          <div className="text-[#d4d3d3] font-[18px] mt-2 max-w-xs sm:max-w-sm md:max-w-md">
            <span className="text-white">{t('universities:division')}:</span>{' '}
            {uni.division}
          </div>
          <div className="text-[#d4d3d3] font-[18px] mt-2 max-w-xs sm:max-w-sm md:max-w-md">
            <span className="text-white mr-2">{t('universities:city')}:</span>
            {uni.city}
          </div>
          <div className="text-[#d4d3d3] font-[18px] mt-2 max-w-xs sm:max-w-sm md:max-w-md">
            <span className="text-white mr-2">{t('universities:state')}:</span>
            {uni.state}
          </div>
          {uni.prev && (
            <div className="text-[#d4d3d3] font-[18px] mt-4 max-w-xs sm:max-w-sm md:max-w-md">
              {prevCheckBox && prevCheckBox}
            </div>
          )}
          <div className="text-[#d4d3d3] font-[18px] mt-4 max-w-xs sm:max-w-sm md:max-w-md">
            {checkBox}
          </div>
        </div>
        <span
          className="text-gray-200 w-4 h-6 md:w-6 md:h-8 top-2 right-2 md:top-4 md:right-4 absolute border-none outline-none bg-transparent"
          onClick={onClose}
        >
          <IconCross />
        </span>
      </div>
    </>
  );
};

export default Content;
