import { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { setCart } from '../../redux/cartSlice';
import formatPrice from '../../utils/formatPrice';
import orderApi from './../../api/orderApi';
import cartApi from './../../api/cartApi';

import LoadingCenter from '../../components/Loading/LoadingCenter';
import { checkIcon } from '../../assets/images/common';

const ThankYou = () => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orderId } = useParams();

  useEffect(() => {
    const getOrder = async () => {
      if (!orderId) return;
      setIsLoading(true);
      try {
        const res = await orderApi.getOrderByOrderId(orderId);
        const order = res.data.order;
        if (order.userId !== currentUser.id) {
          navigate(-1);
          return;
        }
        setOrder(order);
        await cartApi.updateCart([]);
        dispatch(setCart([]));
      } catch (error) {
        console.log(error);
        toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!');
        navigate(-1);
      }
      setIsLoading(false);
    };

    getOrder();
  }, [orderId, currentUser.id, navigate, dispatch]);

  useEffect(() => {
    if (!isLoading && !order) {
      navigate(-1);
    }
  }, [isLoading, navigate, order]);

  return (
    <Fragment>
      {isLoading ? (
        <div className='h-[500px] flex items-center justify-center'>
          <LoadingCenter />
        </div>
      ) : (
        <div className='bg-[#e6e8ea] pt-3 pb-16 -mb-14'>
          <div className='container'>
            <div className='flex flex-col gap-3 lg:gap-12 lg:flex-row'>
              <div className='lg:w-[60%] w-full'>
                <div className='flex gap-4'>
                  <div className='flex-shrink-0 h-[72px]'>
                    <img src={checkIcon} alt='' />
                  </div>
                  <div>
                    <h2 className='mb-0.5 text-xl font-bold'>
                      Cảm ơn bạn đã đặt hàng
                    </h2>
                    <p className='lg:max-w-[80%] leading-4'>
                      <span>Bạn có thể kiểm tra trạng thái đơn hàng </span>
                      <Link
                        to={`/my-info/orders/${order._id}`}
                        className='text-lg font-bold text-primaryColor hover:opacity-80'
                      >
                        tại đây
                      </Link>
                      <span className='inline-block'>
                        Cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm của chúng
                        tôi.
                      </span>
                    </p>
                  </div>
                </div>
                <div className='flex flex-wrap px-5 py-3 border-2 rounded border-borderColor gap-x-5 gap-y-3'>
                  <div className='w-[48%]'>
                    <h3 className='block mb-2 text-2xl font-semibold'>
                      Thông tin mua hàng
                    </h3>
                    <span className='block mb-2'>{order.fullName}</span>
                    <span className='block mb-2'>{order.email}</span>
                    <span>{order.phone}</span>
                  </div>
                  <div className='w-[48%]'>
                    <h3 className='block mb-2 text-2xl font-semibold'>
                      Địa chỉ nhận hàng
                    </h3>
                    <span className='block mb-2'>{order.ward}</span>
                    <span className='block mb-2'>{order.district}</span>
                    <span>{order.city}</span>
                  </div>
                  <div className='w-[48%]'>
                    <h3 className='block mb-2 text-2xl font-semibold'>
                      Phương thức thanh toán
                    </h3>
                    <span className='block mb-2'>{order.paymentMethod}</span>
                  </div>
                  <div className='w-[48%]'>
                    <h3 className='block mb-2 text-2xl font-semibold'>
                      Phương thức vận chuyển
                    </h3>
                    <span className='block mb-2'>{order.shippingMethod}</span>
                  </div>
                </div>
              </div>

              <div className='lg:w-[40%] w-full shadow-md border border-borderColor bg-white'>
                <div className='px-3.5 py-3 border-b border-borderColor'>
                  <h3 className='text-base font-bold'>
                    Đơn hàng {`#${order.id} (${order.cart.length}) `}
                  </h3>
                </div>
                <ul className='max-h-[485px] overflow-y-scroll pt-6'>
                  {order.cart.map((item) => {
                    const { product } = item;
                    return (
                      <li
                        key={product.id}
                        className='flex items-center justify-between gap-8 px-3.5 mb-5'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='w-[50px] h-[50px] border border-borderColor rounded-lg relative select-none'>
                            <img
                              src={product.images[0]?.url}
                              alt={product.name}
                              className='rounded-lg'
                            />
                            <span className='px-1.5 min-w-[20px] h-[20px] select-none text-sm absolute rounded-full bg-primaryColor text-white font-medium top-0 right-0 translate-x-[50%] translate-y-[-50%] inline-flex items-center justify-center'>
                              {item.quantity}
                            </span>
                          </div>
                          <span className='text-base font-medium'>
                            {product.name}
                          </span>
                        </div>

                        <span className='text-base font-medium'>
                          {formatPrice(product.salePrice * item.quantity)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className='px-3.5 pb-3 pt-7 border-y border-borderColor'>
                  <div className='flex justify-between mb-1.5'>
                    <span>Tạm tính</span>
                    <span className='text-lg font-medium'>
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Phí vận chuyển</span>
                    <span className='text-lg font-medium'>
                      {order.shippingFee === 0
                        ? 'Miễn phí'
                        : formatPrice(order.shippingFee)}
                    </span>
                  </div>
                </div>
                <div className='flex justify-between px-3 py-3.5'>
                  <span className='text-lg font-medium'>Tổng cộng</span>
                  <span className='text-2xl font-bold text-primaryColor'>
                    {formatPrice(order.totalPrice + order.shippingFee)}
                  </span>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center mt-12'>
              <Link
                className='inline-block font-semibold min-w-[220px] text-center px-4 py-3 text-base text-white rounded-lg gradient-primary hover:bg-primaryColor hover:bg-none mx-auto'
                to='/'
              >
                <span>Tiếp tục mua hàng</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ThankYou;
