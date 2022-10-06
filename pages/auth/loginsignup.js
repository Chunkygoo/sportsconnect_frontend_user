import React from 'react';
import dynamic from 'next/dynamic';
import Index from '../../components/Auth/Index';

const IndexNoSSR = dynamic(new Promise((res) => res(Index)), {
  ssr: false,
});

export default function loginsignup() {
  return <IndexNoSSR />;
}
