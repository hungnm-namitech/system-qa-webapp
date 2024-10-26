'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Header = ({ pushTo = '/login' }) => {
  const { push } = useRouter();

  return (
    <div className="sticky left-0 top-0 z-50 flex h-[65px] w-full items-center border-b border-[#E8E8E8] bg-white px-4">
      <div
        onClick={() => push(pushTo)}
        className="cursor-pointer font-sans text-[22px] font-bold leading-[25.3px]"
      >
        <span className="text-primary">ManualAgent</span>
      </div>
    </div>
  );
};

export default Header;
