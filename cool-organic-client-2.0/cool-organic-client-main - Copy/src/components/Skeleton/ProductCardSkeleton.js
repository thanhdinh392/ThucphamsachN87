import React from 'react';
import './skeleton.scss';

const ProductCardSkeleton = () => {
  return (
    <div className='border border-borderColor rounded-t-lg'>
      <div className='skeleton aspect-[1/1] !rounded-b-none'></div>
      <div className='flex flex-col items-center justify-center h-[97px]'>
        <h3 className='h-4 skeleton w-[100px]'></h3>
        <p className='h-5 skeleton w-[150px] mt-2'></p>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
