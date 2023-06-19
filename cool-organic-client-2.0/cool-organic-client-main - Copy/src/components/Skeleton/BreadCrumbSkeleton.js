import React from 'react';

const BreadCrumbSkeleton = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='w-[320px] h-10 skeleton mb-3'></div>
      <div className='w-[290px] h-5 skeleton'></div>
    </div>
  );
};

export default BreadCrumbSkeleton;
