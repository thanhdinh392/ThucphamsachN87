import React, { Fragment } from 'react';

const ProductDetailSkeleton = () => {
  return (
    <Fragment>
      <div className='flex items-center justify-center'>
        <div>
          <div className='h-[200px] w-[200px] lg:h-[500px] lg:w-[500px] md:h-[350px] md:w-[350px] skeleton'></div>
          <div className='flex w-full md:w-[320px] lg:w-[545px] gap-3 mt-4 lg:gap-5 flex-start md:pl-10 lg:pl-0 '>
            <div className='w-[88px] h-[84px] skeleton'></div>
            <div className='w-[88px] h-[84px] skeleton'></div>
            <div className='w-[88px] h-[84px] skeleton'></div>
          </div>
        </div>
      </div>
      <div>
        <div className='h-9 skeleton mb-2.5 w-48'></div>
        <div className='h-5 mb-2 w-80 skeleton'></div>
        <div className='h-8 skeleton mb-3.5 w-40'></div>
        <div className='w-40 h-5 mb-3 skeleton'></div>
        <div className='w-40 h-5 mb-4 skeleton'></div>
        <div className='h-24 mb-4 skeleton'></div>
        <hr className='my-6' />
        <div className='h-8 mb-6 skeleton'></div>
        <div className='flex gap-6'>
          <div className='mb-4 md:w-40 lg:w-52 skeleton h-11 !rounded-full'></div>
          <div className='mb-4 w-32 lg:w-36 skeleton h-11 !rounded-full'></div>
        </div>
        <div className='h-5 w-80 skeleton'></div>
      </div>
    </Fragment>
  );
};

export default ProductDetailSkeleton;
