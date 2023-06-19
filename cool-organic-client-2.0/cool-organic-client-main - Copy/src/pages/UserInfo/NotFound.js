import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundNotFound } from '../../assets/images/common';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <div className='md:w-[75%] md:h-[75%] w-full h-full mx-auto select-none'>
        <img src={BackgroundNotFound} alt='Page Not Found' />
      </div>
      <p className='text-lg text-center mt-6'>
        Trang này hiện không có hoặc đã bị gỡ!{' '}
        <span
          onClick={() => navigate(-1)}
          className='text-primaryColor text-xl cursor-pointer hover:opacity-80'
        >
          Quay lại trang trước đó
        </span>
      </p>
    </Fragment>
  );
};

export default NotFound;
