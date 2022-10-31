import React, { Fragment, useEffect, useRef, useState } from 'react';
import Content from './Content';

export default function DetailModal({
  display,
  uni,
  setAllUnis,
  mine,
  searchTerm,
}) {
  const [showModal, setShowModal] = useState(false);
  // prevent scroll when modal is open
  // const firstMount = useRef(true);
  // useEffect(() => {
  //   if (firstMount.current) {
  //     firstMount.current = false;
  //     return;
  //   }
  //   if (showModal) {
  //     document.body.style.overflow = 'hidden';
  //   } else if (!showModal && !firstMount.current) {
  //     document.body.style.overflow = 'unset';
  //   }
  // }, [showModal]);
  // prevent scroll when modal is open

  return (
    <Fragment>
      {display && (
        <span
          className="w-1/3 hover:cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          {display}
        </span>
      )}
      {showModal ? (
        <>
          <div
            // className="fixed top-0 bottom-0 left-0 right-0 bg-[#00000066] flex justify-center items-center z-[200]"
            className="fixed w-screen h-screen z-[200] bg-[#00000066] top-0  left-0  flex justify-center items-center"
            onClick={() => {
              setShowModal(false);
            }}
          >
            <div
              className="relative h-[78vw] sm:h-[60vw] lg:h-[50vw] xl:h-[40vw] 2xl:h-[30vw] w-[90%] -mt-5 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Content
                uni={uni}
                onClose={() => setShowModal(false)}
                setAllUnis={setAllUnis}
                mine={mine}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </>
      ) : null}
    </Fragment>
  );
}
