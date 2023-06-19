import { Fragment } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BreadCrumb from '../../components/BreadCrumb';
import UserInfoContent from './UserInfoContent';
import OrderHistory from './OrderHistory';
import OrderDetail from './OrderDetail';
import ChangePassword from './ChangePassword';
import NotFound from './NotFound';

const navList = [
  {
    name: 'Thông tin tài khoản',
    path: '/my-info',
  },
  {
    name: 'Đơn hàng của bạn',
    path: '/my-info/orders',
  },
  {
    name: 'Đổi mật khẩu',
    path: '/my-info/change-password',
  },
];

const UserInfo = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const location = useLocation();
  return (
    <Fragment>
      <BreadCrumb />
      <div className='container flex flex-wrap'>
        <div className='w-full lg:w-[25%] mb-5 lg:mb-0'>
          <h3 className='mb-4 text-lg font-medium uppercase'>
            Trang Tài khoản
          </h3>
          <span className='block mb-6'>
            <span className='font-bold'>Xin chào, </span>
            <span className='font-bold text-primaryColor'>
              {currentUser.fullName}{' '}
              <span className='font-medium text-black'>!</span>
            </span>
          </span>
          <ul>
            {navList.map((navItem, index) => (
              <li
                key={index}
                className={`mb-6 font-medium hover:text-primaryColor ${
                  location.pathname === navItem.path && 'text-primaryColor'
                }`}
              >
                <Link to={navItem.path}>{navItem.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='w-full lg:w-[75%]'>
          <Routes>
            <Route index element={<UserInfoContent />} />
            <Route path='/orders' element={<OrderHistory />} />
            <Route path='/orders/:id' element={<OrderDetail />} />
            <Route path='/change-password' element={<ChangePassword />} />
            <Route path='/*' element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Fragment>
  );
};

export default UserInfo;
