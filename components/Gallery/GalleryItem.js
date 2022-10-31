import Image from 'next/image';
import React from 'react';
import ProgressiveImg from '../ProgressiveImage';
import DetailModal from './DetailModal';

export default function GalleryItem({ datum, setAllUnis, mine, searchTerm }) {
  let display = datum && (
    <div className="flex flex-wrap w-[95%]">
      <div className="w-full p-1 md:p-2 shadow-xl rounded-lg">
        {/* <ProgressiveImg
          src={datum.backgroundImage}
          placeholderSrc={datum.blurredBackgroundImage}
          width="500"
          height="300"
        /> */}
        <Image
          width={500}
          height={300}
          alt="university image"
          className="block object-cover object-center rounded-lg"
          src={datum.backgroundImage}
          blurDataURL={datum.blurredBackgroundImage}
          placeholder="blur"
        />
        <span className="flex text-[10px] sm:text-sm">
          <span className="mx-auto italic">{datum.name}</span>
        </span>
      </div>
    </div>
  );

  return (
    <DetailModal
      display={display}
      uni={datum}
      setAllUnis={setAllUnis}
      mine={mine}
      searchTerm={searchTerm}
    />
  );
}
