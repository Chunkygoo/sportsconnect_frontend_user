import Image from 'next/image';
import { useState, useEffect } from 'react';

const ProgressiveImg = ({ placeholderSrc, src, ...props }) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
    };
  }, [src]);

  const customClass =
    placeholderSrc && imgSrc === placeholderSrc ? 'blur' : 'blur-none';

  return (
    // <img
    //   {...{ src: imgSrc, ...props }}
    //   alt={props.alt || ''}
    //   className={`block max-w-full h-auto ${customClass} ${props.className}`}
    // />
    <Image
      {...{ src: imgSrc, ...props }}
      alt={props.alt || ''}
      className={`block max-w-full h-auto ${customClass} ${props.className}`}
      layout="fill"
    />
  );
};
export default ProgressiveImg;
