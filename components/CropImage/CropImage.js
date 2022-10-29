import React, { Fragment, useEffect, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { canvasPreview } from './canvasPreview';
import { AiOutlineClose } from 'react-icons/ai';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

export default function CropImage({ uploadProfilePhoto, display }) {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState('');
  const [imageName, setImageName] = useState('');
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [error, setError] = useState(null);
  const [imageType, setImageType] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
    }
  }, [completedCrop]);

  let reset = () => {
    setImgSrc('');
    setImageName('');
    imgRef = null;
    previewCanvasRef = null;
    setCrop(null);
    setCompletedCrop(null);
    setError(null);
    setImageType('');
  };

  let sendProfilePhoto = async () => {
    let uploadBlob = async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, imageName);
      await uploadProfilePhoto(formData);
    };
    if (completedCrop) {
      previewCanvasRef.current.toBlob((blob) => {
        uploadBlob(blob);
      }, imageType);
    } else {
      let blob = await fetch(imgSrc).then((r) => r.blob());
      uploadBlob(blob);
    }
  };

  let onSelectFile = (e) => {
    setImgSrc(null);
    setError('');
    if (e.target.files && e.target.files.length > 0) {
      if (!e.target.files[0].name.match(/\.(jpg|jpeg|png|gif)$/)) {
        setError('Select a valid image file');
        return;
      }
      if (e.target.files[0].size > 5000000) {
        // file size greater than 5mb
        setError('File size must be < 5 Mb');
        return;
      }
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
      setImageName(e.target.files[0].name);
      setImageType(e.target.files[0].type);
    }
  };

  let description = (
    <div>
      {error && (
        <span className="text-red-700 flex justify-between text-md ">
          {error}
          <AiOutlineClose
            onClick={() => setError('')}
            className="hover:cursor-pointer mt-1"
          />
        </span>
      )}
      {!(completedCrop || imgSrc) && (
        <input
          className="block w-full mb-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
          type="file"
          accept="image/*"
          onChange={onSelectFile}
        />
      )}
      <span>
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
        >
          {imgSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img ref={imgRef} src={imgSrc} alt="uploaded photo" />
          )}
        </ReactCrop>
      </span>
      <span className="hidden">
        <canvas ref={previewCanvasRef} />
      </span>
    </div>
  );

  return (
    <Fragment>
      {display && (
        <button
          className="text-blue-800"
          type="button"
          onClick={() => setShowModal(true)}
        >
          {display}
        </button>
      )}
      {showModal ? (
        <>
          <div
            className="fixed top-0 bottom-0 left-0 right-0 bg-[#00000066] flex justify-center items-center z-[200]"
            onClick={() => {
              setShowModal(false);
              reset();
            }}
          >
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none m-8">
              <div
                className="relative w-auto my-6 mx-auto max-w-3xl"
                onClick={(e) => {
                  // do not close modal if anything inside modal content is clicked
                  e.stopPropagation();
                }}
              >
                <div className="fborder-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="relative p-6 flex-auto">
                    <span className="my-4 text-slate-500 text-lg leading-relaxed">
                      {description}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border-t border-solid border-slate-200 rounded-b text-xs sm:text-base">
                    <div className="p-3 mr-1">{t('portfolio:crop_image')}</div>
                    <div>
                      <button
                        className="bg-emerald-500 mr-4 text-white active:bg-emerald-600 font-bold text-xs sm:text-sm px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          reset();
                          setShowModal(false);
                        }}
                      >
                        {t('portfolio:cancel')}
                      </button>
                      <button
                        className="bg-blue-500 text-white active:bg-blue-600 font-bold text-xs sm:text-sm px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          sendProfilePhoto();
                          setShowModal(false);
                        }}
                        disabled={!completedCrop && !imgSrc}
                      >
                        {t('portfolio:upload')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </Fragment>
  );
}
