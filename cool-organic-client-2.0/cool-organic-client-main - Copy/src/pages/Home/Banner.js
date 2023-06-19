import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';

import { banner1 as bannerImgUrl1 } from '../../assets/images/common';

const listImages = [
  {
    id: 1,
    imageUrl: bannerImgUrl1,
  },
  {
    id: 2,
    imageUrl: bannerImgUrl1,
  },
];

const Banner = () => {
  return (
    <Swiper
      slidesPerView={1}
      loop
      speed={600}
      navigation
      pagination
      className='banner h-[60vh] md:h-[55vh] lg:h-[88vh]'
      modules={[Navigation, Pagination]}
    >
      {listImages.map((item, index) => (
        <SwiperSlide key={index} className='h-full'>
          <div
            style={{ backgroundImage: `url(${item.imageUrl})` }}
            className='h-full bg-cover bg-[#BEDFCB] bg-[left_15%_center] md:bg-[left_10%_center] lg:bg-[center_10%_center]'
          ></div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
