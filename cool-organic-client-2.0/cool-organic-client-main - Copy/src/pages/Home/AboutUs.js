import React from 'react';

import SectionLayout from '../../components/SectionLayout';
import {
  aboutUs1,
  aboutUs2,
  aboutUs3,
  aboutUs4,
} from '../../assets/images/common';

const listItems = [
  {
    title: 'Trang trại hữu cơ',
    description: 'Cung cấp 100% thực phẩm sạch đảm bảo an toàn và ngon nhất',
    imageUrl: aboutUs1,
  },
  {
    title: 'Thực phẩm sạch',
    description: 'Cung cấp 100% thực phẩm sạch đảm bảo an toàn và ngon nhất',
    imageUrl: aboutUs2,
  },
  {
    title: 'An toàn sinh học',
    description: 'Cung cấp 100% thực phẩm sạch đảm bảo an toàn và ngon nhất',
    imageUrl: aboutUs3,
  },
  {
    title: 'Đa dạng sinh học',
    description: 'Cung cấp 100% thực phẩm sạch đảm bảo an toàn và ngon nhất',
    imageUrl: aboutUs4,
  },
];

const AboutUs = () => {
  return (
    <SectionLayout title='Về chúng tôi' path='/introduce'>
      <p className='lg:mb-10 mb-6 md:mb-8  text-[#8b8b99] text-sm max-w-[840px] w-full mx-auto'>
        Hiện tại vùng nguyên liệu của chúng tôi có thể cung cấp các thực tập
        tươi sạch với số lượng lớn vì đang vào vụ mùa thu hoạch nên chúng tôi có
        thể cung ứng cho tất cả các đối tác xuất khẩu nông sản trên cả nước.
      </p>
      <div className='flex justify-between gap-8 scroll-snap-list'>
        {listItems.map((item, index) => (
          <div
            key={index}
            className='flex flex-col items-center scroll-snap-item'
          >
            <div className='lg:w-[135px] lg:h-[127px] w-[100px] h-[96px]'>
              <img src={item.imageUrl} alt='' />
            </div>
            <h3 className='py-1 text-base font-bold leading-[1.125rem] lg:text-lg md:pt-3.5'>
              {item.title}
            </h3>
            <p className='lg:leading-6 leading-4 text-textColor max-w-[280px] w-full md:text-sm text-xs'>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
};

export default AboutUs;
