import React from 'react';
import Portfolio from '../../components/Portfolio/Portfolio';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';

export default function portfolio() {
  return (
    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl min-h-[80vh]">
      <SessionAuth>
        <Portfolio currentUser={true} />
      </SessionAuth>
    </div>
  );
}
