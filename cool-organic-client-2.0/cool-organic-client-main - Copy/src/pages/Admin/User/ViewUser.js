import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';

import OrderHistory from '../../UserInfo/OrderHistory';
import userApi from '../../../api/userApi';

const ViewUser = () => {
  const [user, setUser] = useState({});

  const { id } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userApi.getUserById(id);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [id]);

  return (
    <Fragment>
      <div>
        <h2 className='pt-8 pb-5 text-2xl font-semibold'>
          Thông tin người dùng
        </h2>
        <div>
          <p className='block text-lg'>
            <span className='font-semibold'>Họ và tên:</span> {user.fullName}
          </p>
          <p className='text-lg'>
            <span className='font-semibold'>Email:</span> {user.email}
          </p>
          <p className='text-lg'>
            <span className='font-semibold'>Số điện thoại:</span> {user.phone}
          </p>
          <p className='text-lg'>
            <span className='font-semibold'>Địa chỉ:</span> {user.address}
          </p>
        </div>
      </div>
      <div>
        <h2 className='pt-8 pb-5 text-2xl font-semibold'>Đơn hàng gần đây</h2>
        <OrderHistory userId={id} />
      </div>
    </Fragment>
  );
};

export default ViewUser;
