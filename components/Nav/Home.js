import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <Link href="/home">
      <div className="flex items-center">
        {/* <img
          className="mr-3 h-6 sm:h-9"
          alt="Logo"
          src="/logo.png"
          width="40"
          height="40"
        /> */}
        <Image
          width={40}
          height={40}
          src="/logo.png"
          className="mr-3 h-6 sm:h-9"
          alt="Logo"
        />
        <span className="self-center text-xl font-semibold whitespace-nowrap ml-4">
          SportsConnect
        </span>
      </div>
    </Link>
  );
}
