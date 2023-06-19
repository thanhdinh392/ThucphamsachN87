import React from 'react';

import {
  imgProduct1,
  imgProduct2,
  imgProduct3,
  imgProduct4,
} from '../../assets/images/common';

const listProducts = [
  {
    id: 1,
    name: 'Rau quả tươi',
    imageUrl: imgProduct1,
    description:
      'Chúng tôi cam kết 100% các sản phẩm có nguồn gốc xuất xứ rõ ràng, sạch, an toàn và đảm bảo chất lượng ngon nhất giao đến tận tay người tiêu dùng, để san sẻ sự vất vả của các mẹ, các chị',
  },
  {
    id: 2,
    name: 'Sinh tố hoa quả',
    imageUrl: imgProduct2,
    description:
      'Chúng tôi cam kết 100% các sản phẩm có nguồn gốc xuất xứ rõ ràng, sạch, an toàn và đảm bảo chất lượng ngon nhất giao đến tận tay người tiêu dùng, để san sẻ sự vất vả của các mẹ, các chị',
  },
  {
    id: 3,
    name: 'Thực phẩm tươi',
    imageUrl: imgProduct3,
    description:
      'Chúng tôi cam kết 100% các sản phẩm có nguồn gốc xuất xứ rõ ràng, sạch, an toàn và đảm bảo chất lượng ngon nhất giao đến tận tay người tiêu dùng, để san sẻ sự vất vả của các mẹ, các chị',
  },
  {
    id: 4,
    name: 'Hoa quả tươi mát',
    imageUrl: imgProduct4,
    description:
      'Chúng tôi cam kết 100% các sản phẩm có nguồn gốc xuất xứ rõ ràng, sạch, an toàn và đảm bảo chất lượng ngon nhất giao đến tận tay người tiêu dùng, để san sẻ sự vất vả của các mẹ, các chị',
  },
];

const ProductListIntroduce = () => {
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 product-list-introduce'>
        {listProducts.map((product) => (
          <div
            key={product.id}
            className='relative py-6 pl-5 pr-24 md:py-12 md:pl-8 lg:pl-12 lg:py-32 before before:invisible hover:before:visible before:bg-black before:absolute before:w-full before:h-full before:top-0 before:left-0 before:opacity-0 hover:before:opacity-50'
            style={{
              backgroundImage: `url(${product.imageUrl}`,
              backgroundSize: '50% auto',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
            }}
          >
            <div className='relative'>
              <h3 className='mb-2.5 hover:text-primaryColor cursor-pointer text-2xl font-medium transition-all text-white'>
                {product.name}
              </h3>
              <p className='mb-12 text-sm leading-6 text-white'>
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListIntroduce;
