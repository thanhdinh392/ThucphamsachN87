import { Fragment } from 'react';

const ProductDetailSkeletonMobile = () => {
  return (
    <Fragment>
      <div className='flex items-center justify-center'>
        <div>
          <div className='w-full aspect-[1/1] skeleton'></div>
          <div className='flex w-full gap-3 pl-6 mt-4 flex-start'>
            <div className='w-[98px] h-[84px] skeleton'></div>
            <div className='w-[98px] h-[84px] skeleton'></div>
            <div className='w-[98px] h-[84px] skeleton'></div>
          </div>
        </div>
      </div>
      <div>
        <div className='h-9 skeleton mb-2.5 w-48'></div>
        <div className='h-5 mb-1 w-60 skeleton'></div>
        <div className='h-5 mb-2 w-60 skeleton'></div>
        <div className='h-8 skeleton mb-3.5 w-40'></div>
        <div className='w-40 h-5 mb-3 skeleton'></div>
        <div className='w-40 h-5 mb-4 skeleton'></div>
        <div className='w-full h-24 mb-4 skeleton'></div>
        <hr className='my-6' />
        <div className='h-10 mb-6 skeleton'></div>
        <div className='flex gap-6'>
          <div className='mb-4 w-44 skeleton h-11 !rounded-full'></div>
          <div className='mb-4 w-32 skeleton h-11 !rounded-full'></div>
        </div>
        <div className='w-full h-5 skeleton'></div>
      </div>
    </Fragment>
  );
};

export default ProductDetailSkeletonMobile;
