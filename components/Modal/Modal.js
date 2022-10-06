import React, { Fragment, useState } from 'react';

export default function Modal({
  display,
  title,
  description,
  link,
  initialShow = false,
}) {
  const [showModal, setShowModal] = useState(initialShow);
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
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex justify-center p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">{title}</h3>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <p className="my-4 text-slate-500 text-lg leading-relaxed">
                      {description}
                    </p>
                    {link && (
                      <p className="my-4 text-blue-500 text-lg leading-relaxed underline">
                        {link}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      OK
                    </button>
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
