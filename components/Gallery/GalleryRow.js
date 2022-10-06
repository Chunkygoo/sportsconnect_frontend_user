import React from 'react';
import GalleryItem from './GalleryItem';

export default function GalleryRow({ dataChunk, updateTickedUni }) {
  return (
    <>
      <section className="overflow-hidden text-gray-700 ">
        <div className="px-5 xl:px-3 py-2 mx-auto">
          <div className="flex flex-wrap m-1">
            {
              // uni might be non-existent because we delete it from my universities
              dataChunk[0] && (
                <GalleryItem
                  key={dataChunk[0].id}
                  datum={dataChunk[0]}
                  updateTickedUni={updateTickedUni}
                />
              )
            }
            {
              // uni might be non-existent because we delete it from my universities
              dataChunk[1] && (
                <GalleryItem
                  key={dataChunk[1]?.id}
                  datum={dataChunk[1]}
                  updateTickedUni={updateTickedUni}
                />
              )
            }
            {
              // uni might be non-existent because we delete it from my universities
              dataChunk[2] && (
                <GalleryItem
                  key={dataChunk[2]?.id}
                  datum={dataChunk[2]}
                  updateTickedUni={updateTickedUni}
                />
              )
            }
          </div>
        </div>
      </section>
    </>
  );
}
