import { Link } from 'react-router-dom';

import BreadCrumb from '../../components/BreadCrumb';
import { BackgroundNotFound } from '../../assets/images/common';

const NotFound = () => {
  return (
    <div>
      <BreadCrumb>Trang không tồn tại</BreadCrumb>
      <div className='container flex flex-col items-center justify-center'>
        <div className='h-[600px] select-none'>
          <img src={BackgroundNotFound} alt='Page Not Found' />
        </div>
        <h2 className='mt-6 text-lg'>
          Trang này hiện không có hoặc đã bị gỡ! Vui lòng quay lại{' '}
          <Link to='/' className='text-xl text-primaryColor hover:opacity-80'>
            trang chủ
          </Link>
        </h2>
      </div>
    </div>
  );
};

export default NotFound;
