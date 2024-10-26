import React from 'react';

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center gap-3 text-black">
      <h1 className="text-[24px] font-bold">404</h1>
      <div className="h-5 w-[1px] bg-black"></div>
      <p className="text-[14px]">This page could not be found.</p>
    </div>
  );
}
