import { Link } from 'react-router-dom';

import SectionLayout from '../../components/SectionLayout';
import {
  brand1,
  brand2,
  brand3,
  brand4,
  brand5,
  brand6,
} from '../../assets/images/common';

const brandList = [
  {
    imageUrl: brand1,
    path: '/',
  },
  {
    imageUrl: brand2,
    path: '/',
  },
  {
    imageUrl: brand3,
    path: '/',
  },
  {
    imageUrl: brand4,
    path: '/',
  },
  {
    imageUrl: brand5,
    path: '/',
  },
  {
    imageUrl: brand6,
    path: '/',
  },
];

const TopBrand = () => {
  return (
    <SectionLayout title='Top thương hiệu'>
      <div className='container flex mt-5 scroll-snap-list gap-14 lg:justify-center lg:mx-auto'>
        {brandList.map((brand, index) => (
          <Link
            key={index}
            to={brand.path}
            className='transition-all scroll-snap-item hover:opacity-80 shrink-0'
          >
            <img src={brand.imageUrl} alt='' />
          </Link>
        ))}
      </div>
    </SectionLayout>
  );
};

export default TopBrand;
