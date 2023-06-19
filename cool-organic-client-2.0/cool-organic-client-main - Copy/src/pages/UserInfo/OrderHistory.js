import { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { LoadingCenter } from '../../components/Loading';
import Pagination from '../../components/Pagination/Pagination';
import orderApi from './../../api/orderApi';
import formatPrice from './../../utils/formatPrice';
import formatDate from '../../utils/formatDate';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const getOrders = async () => {
      setIsLoading(true);
      try {
        const res = await orderApi.getOrdersByUserId(userId || currentUser.id, {
          params: {
            page: currentPage,
            limit: 10,
          },
        });
        setOrders(res.data.orders);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    getOrders();
  }, [currentPage, userId, currentUser.id]);

  return (
    <div>
      {isLoading && (
        <div className='flex items-center justify-center h-96'>
          <LoadingCenter />
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className='flex items-center justify-center h-60'>
          {userId && (
            <h2 className='text-2xl font-semibold'>
              Người dùng này chưa có đơn hàng nào
            </h2>
          )}
          {!userId && (
            <div className='flex flex-col items-center justify-center'>
              <h2 className='mb-4 text-2xl font-semibold'>
                Hiện bạn chưa có đơn hàng nào
              </h2>
              <Link
                className='inline-block px-3 py-3 text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
                to='/products'
              >
                Mua sắm ngay tại đây
              </Link>
            </div>
          )}
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <Fragment>
          <table className='w-full border border-collapse table-auto border-borderColor'>
            <thead>
              <tr>
                <th className='px-1 py-1.5 font-medium text-center text-white border border-borderColor bg-primaryColor'>
                  Mã Đơn Hàng
                </th>
                <th className='px-1 py-1.5 font-medium text-center text-white border border-borderColor bg-primaryColor'>
                  Ngày Đặt Hàng
                </th>
                <th className='px-1 py-1.5 font-medium text-center text-white border border-borderColor bg-primaryColor'>
                  Địa Chỉ Giao Hàng
                </th>
                <th className='px-1 py-1.5 font-medium text-center text-white border border-borderColor bg-primaryColor'>
                  Giá Trị Đơn Hàng
                </th>
                <th className='px-1 py-1.5 font-medium text-center text-white border border-borderColor bg-primaryColor'>
                  Trạng Thái Thanh Toán
                </th>
                <th className='px-1 py-1.5 font-medium text-center text-white border border-borderColor bg-primaryColor'>
                  Trạng Thái Vận Chuyển
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className='px-1 py-2 text-center border border-borderColor'>
                    <Link
                      to={`${
                        userId
                          ? `/admin/orders/view/${order.id}`
                          : `/my-info/orders/${order.id}`
                      }`}
                      className='text-[#2F80ED] hover:opacity-80'
                    >
                      #{order.id}
                    </Link>
                  </td>
                  <td className='px-1 py-2 text-center border border-borderColor'>
                    {formatDate(order.createdAt)}
                  </td>
                  <td className='px-1 py-2 text-center border border-borderColor'>
                    {`${order.ward}, ${order.district}, ${order.city}`}
                  </td>
                  <td className='px-1 py-2 text-center border border-borderColor'>
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className='px-1 py-2 text-center border border-borderColor'>
                    {order.paymentStatus}
                  </td>
                  <td className='px-1 py-2 text-center border border-borderColor'>
                    {order.shippingStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page.selected + 1)}
            className='my-8'
          />
        </Fragment>
      )}
    </div>
  );
};

OrderHistory.propTypes = {
  userId: PropTypes.string,
};

export default OrderHistory;
