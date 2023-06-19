import { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { LoadingCenter } from '../../components/Loading';
import formatDate from './../../utils/formatDate';
import formatPrice from './../../utils/formatPrice';
import orderApi from './../../api/orderApi';

const OrderDetail = ({ handleSetStatusOrder, isFetch }) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrder = async () => {
      setIsLoading(true);
      try {
        const res = await orderApi.getOrderByOrderId(id);
        const order = res.data.order;
        if (handleSetStatusOrder) {
          handleSetStatusOrder(order);
        }
        if (order.userId === currentUser.id || currentUser.role === 'admin') {
          setOrder(order);
        }
      } catch (error) {
        toast.error('Đã có lỗi xảy ra, Vui lòng thử lại sau!');
        navigate(-1);
      }
      setIsLoading(false);
    };

    getOrder();
  }, [id, currentUser.id, currentUser.role, isFetch, navigate]);

  return (
    <Fragment>
      {isLoading && (
        <div className='flex items-center justify-center h-96'>
          <LoadingCenter />
        </div>
      )}

      {!isLoading && !order && (
        <div className='flex items-center justify-center h-60'>
          <h2 className='text-xl font-semibold'>
            Hiện không tìm thấy đơn hàng. Vui lòng thử lại sau!
          </h2>
        </div>
      )}

      {!isLoading && order && (
        <div>
          <h2 className='flex items-center justify-between mb-7'>
            <span>Chi tiết đơn hàng #{order.id}</span>
            <span>Ngày tạo: {formatDate(order.createdAt)}</span>
          </h2>
          <div className='flex items-center gap-5 mb-8'>
            <span>
              Trạng thái thanh toán:{' '}
              <span
                className={`font-semibold ${
                  order.paymentStatus === 'Chưa thanh toán'
                    ? 'text-red-500'
                    : 'text-primaryColor'
                }`}
              >
                {order.paymentStatus}
              </span>
            </span>
            <span>
              Trạng thái vận chuyển:{' '}
              <span
                className={`font-semibold ${
                  order.shippingStatus === 'Chưa giao hàng'
                    ? 'text-red-500'
                    : 'text-primaryColor'
                }`}
              >
                {order.shippingStatus}
              </span>
            </span>
          </div>

          <div className='grid grid-cols-6 gap-5 mb-14'>
            <div className='col-span-2'>
              <h3 className='mb-1 text-lg font-medium uppercase'>
                Thông tin người nhận
              </h3>
              <div className='h-full px-5 pt-3 border rounded-lg border-borderColor'>
                <span className='block mb-2'>Họ và tên: {order.fullName}</span>
                <span className='block mb-2'>
                  Địa chỉ: {`${order.ward}, ${order.district}, ${order.city}`}
                </span>
                <span className='block mb-2'>Số điện thoại: {order.phone}</span>
              </div>
            </div>
            <div>
              <h3 className='mb-1 text-lg font-medium uppercase'>Thanh toán</h3>
              <div className='h-full px-5 pt-3 border rounded-lg border-borderColor'>
                <span>{order.paymentMethod}</span>
              </div>
            </div>
            <div>
              <h3 className='mb-1 text-lg font-medium uppercase'>Vận chuyển</h3>
              <div className='h-full px-5 pt-3 border rounded-lg border-borderColor'>
                <span>{order.shippingMethod}</span>
              </div>
            </div>
            <div className='col-span-2'>
              <h3 className='mb-1 text-lg font-medium uppercase'>Ghi chú</h3>
              <div className='h-full px-5 pt-3 border rounded-lg border-borderColor'>
                <p>{order.comment}</p>
              </div>
            </div>
          </div>

          <table className='w-full mb-6 border border-borderColor'>
            <thead>
              <tr className='border-b border-borderColor'>
                <th className='p-6 text-left w-[55%]'>Sản phẩm</th>
                <th className='p-6 text-center'>Đơn giá</th>
                <th className='p-6 text-center'>Số lượng</th>
                <th className='p-6 text-center'>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.cart.map((item) => {
                const product = item.product;
                return (
                  <tr key={product._id} className='border-b border-borderColor'>
                    <td className='px-5 py-3'>
                      <div className='w-[55%] flex gap-10 items-center'>
                        <Link
                          to={`/products/${product.slug}`}
                          className='w-[90px] h-[90px] hover:opacity-80 text-center'
                        >
                          <img src={product.images[0].url} alt={product.name} />
                        </Link>
                        <Link
                          to={`/products/${product.slug}`}
                          className='font-medium transition-all hover:text-primaryColor'
                        >
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className='text-center'>
                      <span className='font-medium'>
                        {formatPrice(product.salePrice)}
                      </span>
                    </td>
                    <td className='text-center'>
                      <span className='font-medium'>{item.quantity}</span>
                    </td>
                    <td className='text-center'>
                      <span className='font-medium'>
                        {formatPrice(item.quantity * product.salePrice)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td></td>
                <td className='p-8'>
                  <span className='block mb-5 text-base'>Phí vận chuyển</span>
                  <span className='block text-base'>Tổng tiền</span>
                </td>
                <td className='p-8'>
                  <span className='block mb-5 text-base font-medium'>
                    {formatPrice(order.shippingFee)}
                  </span>
                  <span className='block text-xl font-bold text-primaryColor'>
                    {formatPrice(order.totalPrice)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Fragment>
  );
};

OrderDetail.propTypes = {
  handleSetStatusOrder: PropTypes.func,
  isFetch: PropTypes.bool,
};

export default OrderDetail;
