import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';

import { LoadingCenter } from '../../../components/Loading';
import Pagination from '../../../components/Pagination/Pagination';
import Modal from '../../../components/Modal/Modal';
import Portal from '../../../components/Modal/Portal';
import formatPrice from '../../../utils/formatPrice';
import orderApi from './../../../api/orderApi';
import formatDate from './../../../utils/formatDate';
import ChangePerPage from '../components/ChangePerPage';

const paymentStatusOptions = [
  {
    value: 'Chưa thanh toán',
    label: 'Chưa thanh toán',
  },
  {
    value: 'Đã thanh toán',
    label: 'Đã thanh toán',
  },
];

const shippingStatusOptions = [
  {
    value: 'Chưa giao hàng',
    label: 'Chưa giao hàng',
  },
  {
    value: 'Đang vận chuyển',
    label: 'Đang vận chuyển',
  },
  {
    value: 'Giao hàng thành công',
    label: 'Giao hàng thành công',
  },
];

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndexOfOrder, setCurrentIndexOfOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState({
    value: 10,
    label: '10',
  });
  const [totalPages, setTotalPages] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [shippingStatus, setShippingStatus] = useState(null);

  const [showModalDeleteOrder, setShowModalDeleteOrder] = useState(false);
  const [showModalUpdateOrder, setShowModalUpdateOrder] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      setIsLoading(true);
      try {
        const res = await orderApi.getOrders({
          params: {
            page: currentPage,
            limit: limit.value,
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
  }, [currentPage, limit]);

  const handleDeleteOrder = async () => {
    try {
      await orderApi.deleteOrder(currentOrderId);
      const newOrders = orders.filter((order) => order.id !== currentOrderId);
      setOrders(newOrders);
      toast.success('Xóa đơn hàng thành công!');
    } catch (error) {
      console.log(error);
      toast.error('Xóa đơn hàng thất bại, Vui lòng thử lại sau!');
    }
    setShowModalDeleteOrder(false);
  };

  const handleUpdateOrder = async () => {
    try {
      const res = await orderApi.updateStatusOrder(currentOrderId, {
        shippingStatus: shippingStatus.value,
        paymentStatus: paymentStatus.value,
      });
      const newOrderList = orders.map((order) => {
        if (order._id === res.data.order._id) {
          return res.data.order;
        }
        return order;
      });

      setOrders(newOrderList);
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
    } catch (error) {
      console.log(error);
      toast.error('Cập nhật trạng thái đơn hàng không thành công!');
    }
    setShowModalUpdateOrder(false);
  };

  return (
    <div>
      <h2 className='pt-8 text-2xl font-semibold'>Đơn Hàng</h2>
      <ChangePerPage
        textDisplay='Đơn hàng mỗi trang: '
        limit={limit}
        setLimit={setLimit}
      />
      {isLoading ? (
        <div className='flex items-center justify-center h-[516px]'>
          <LoadingCenter />
        </div>
      ) : (
        <Fragment>
          <table className='w-full border border-collapse table-auto border-borderColor'>
            <thead>
              <tr>
                <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                  STT
                </th>
                <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                  Ngày Đặt Hàng
                </th>
                <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                  Địa Chỉ Giao Hàng
                </th>
                <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                  Giá Trị Đơn Hàng
                </th>
                <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                  Trạng Thái Thanh Toán
                </th>
                <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                  Trạng Thái Vận Chuyển
                </th>
                <th className='px-1 py-5 font-bold text-center border-b border-[#ccc]'>
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                    {(currentPage - 1) * limit.value + index + 1}
                  </td>
                  <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                    {formatDate(order.createdAt)}
                  </td>
                  <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                    {`${order.ward}, ${order.district}, ${order.city}`}
                  </td>
                  <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                    {order.paymentStatus}
                  </td>
                  <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                    {order.shippingStatus}
                  </td>
                  <td className='px-1 py-5 font-semibold text-center border-b border-[#ccc]'>
                    <Link
                      className='py-2 px-5 inline-block border rounded-lg text-primaryColor border-[#ccc] hover:text-white hover:bg-primaryColor transition-colors'
                      to={`${window.location.pathname}/view/${order.id}`}
                    >
                      Xem
                    </Link>
                    <button
                      className='ml-2.5 py-2 inline-block px-5 border rounded-lg text-thirdColor border-[#ccc] hover:text-white hover:bg-thirdColor transition-colors'
                      onClick={() => {
                        setCurrentOrderId(order.id);
                        setCurrentIndexOfOrder(index);
                        setPaymentStatus({
                          value: order.paymentStatus,
                          label: order.paymentStatus,
                        });
                        setShippingStatus({
                          value: order.shippingStatus,
                          label: order.shippingStatus,
                        });
                        setShowModalUpdateOrder(true);
                      }}
                    >
                      Sửa
                    </button>
                    {order.shippingStatus === 'Giao hàng thành công' &&
                    order.paymentStatus === 'Đã thanh toán' ? (
                      <></>
                    ) : (
                      <button
                        className='ml-2.5 text-red-500 py-2 px-5 border rounded-lg  border-[#ccc] hover:bg-red-500 hover:text-white transition-colors'
                        onClick={() => {
                          setShowModalDeleteOrder(true);
                          setCurrentOrderId(order.id);
                        }}
                      >
                        Xóa
                      </button>
                    )}
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

      {showModalDeleteOrder && (
        <Portal
          showModal={showModalDeleteOrder}
          classContainer={'modal-delete-order'}
        >
          <Modal
            showModal={showModalDeleteOrder}
            handleCloseModal={() => setShowModalDeleteOrder(false)}
            className='fixed z-[2000] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl overflow-hidden bg-white w-[500px] px-5 pb-4 shadow-lg'
          >
            <Modal.Header
              handleCloseModal={() => setShowModalDeleteOrder(false)}
              className='pt-4 mb-3'
            >
              <h2 className='text-xl font-semibold leading-6 w-[85%]'>
                Bạn có chắc chắn muốn xóa đơn hàng này không?
              </h2>
            </Modal.Header>
            <Modal.Body className='mb-5'>
              <p className='text-lg leading-5'>
                Bạn có chắc chắn muốn xóa đơn hàng này không? Sau khi xóa, bạn
                sẽ không thể khôi phục lại thông tin đơn hàng này.
              </p>
              <span className='block mt-5'>
                <span className='text-red-500'>*</span> Sau khi xóa đơn hàng,
                khách hàng của bạn sẽ được thông báo rằng đơn hàng đã bị hủy.
              </span>
            </Modal.Body>
            <Modal.Footer className='pb-1.5'>
              <div className='flex items-center justify-end gap-3'>
                <button
                  className='px-4 py-3 text-white transition-opacity rounded-md bg-slate-400 hover:opacity-80 min-w-[80px]'
                  onClick={() => setShowModalDeleteOrder(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className='px-4 py-3 text-white transition-opacity bg-red-500 rounded-md hover:opacity-80 min-w-[80px]'
                  onClick={handleDeleteOrder}
                >
                  Xóa
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        </Portal>
      )}

      {showModalUpdateOrder && (
        <Portal
          showModal={showModalUpdateOrder}
          classContainer={'modal-Update-order'}
        >
          <Modal
            showModal={showModalUpdateOrder}
            handleCloseModal={() => setShowModalUpdateOrder(false)}
            className='fixed z-[2000] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-xl overflow-hidden bg-white w-[600px] px-6 pb-8 shadow-lg'
          >
            <Modal.Header
              handleCloseModal={() => setShowModalUpdateOrder(false)}
              className='pt-6 mb-3'
            >
              <h2 className='text-xl font-semibold leading-6 w-[85%]'>
                Cập nhật trạng thái đơn hàng
              </h2>
            </Modal.Header>
            <Modal.Body className='mb-5'>
              <h3 className='mb-2 text-lg font-semibold'>
                Cập nhật trạng thái cho đơn hàng STT{' '}
                {(currentPage - 1) * limit.value + currentIndexOfOrder + 1}
              </h3>
              <form className='flex justify-between gap-3'>
                <div className='flex-1 mb-5'>
                  <label
                    className='font-semibold ml-0.5 mb-1.5 block'
                    htmlFor='paymentStatus'
                  >
                    Trạng thái thanh toán
                  </label>
                  <Select
                    isSearchable={false}
                    maxMenuHeight={200}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        height: '50px',
                        borderRadius: '0.5rem',
                        outline: 'none',
                        boxShadow: 'none',
                        fontSize: '1rem',
                        border: state.isFocused
                          ? '2px solid #91ad41'
                          : '2px solid #ebebeb',

                        ':hover': {
                          borderColor: '#91ad41',
                        },
                        ':active': {
                          borderColor: '#91ad41',
                        },
                        ':focus': {
                          borderColor: '#91ad41',
                        },
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        padding: '12px 12px',
                        border: '2px solid #ebebeb',
                        borderRadius: '0.2rem',
                        fontSize: '1rem',
                        backgroundColor: state.isSelected ? '#91ad41' : '#fff',
                        color: state.isSelected ? '#fff' : '#000',
                        ':active': {
                          backgroundColor: '#91ad41',
                          color: '#fff',
                        },
                      }),
                      input: (baseStyles) => ({
                        ...baseStyles,
                        padding: '4px 0px',
                        pointerEvents: 'none',
                      }),
                      singleValue: (baseStyles) => ({
                        ...baseStyles,
                        padding: '4px 0px',
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        padding: '0px',
                        height: '100%',
                        backgroundColor: '#fff',
                        boxShadow: 'none',
                        border: 'none',
                      }),
                    }}
                    options={paymentStatusOptions}
                    onChange={setPaymentStatus}
                    defaultValue={paymentStatus}
                    value={paymentStatus}
                  />
                </div>
                <div className='flex-1 mb-5'>
                  <label
                    className='font-semibold ml-0.5 mb-1.5 block'
                    htmlFor='shippingStatus'
                  >
                    Trạng thái vận chuyển
                  </label>
                  <Select
                    isSearchable={false}
                    maxMenuHeight={200}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        height: '50px',
                        borderRadius: '0.5rem',
                        outline: 'none',
                        boxShadow: 'none',
                        fontSize: '1rem',
                        border: state.isFocused
                          ? '2px solid #91ad41'
                          : '2px solid #ebebeb',

                        ':hover': {
                          borderColor: '#91ad41',
                        },
                        ':active': {
                          borderColor: '#91ad41',
                        },
                        ':focus': {
                          borderColor: '#91ad41',
                        },
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        padding: '12px 12px',
                        border: '2px solid #ebebeb',
                        borderRadius: '0.2rem',
                        fontSize: '1rem',
                        backgroundColor: state.isSelected ? '#91ad41' : '#fff',
                        color: state.isSelected ? '#fff' : '#000',
                        ':active': {
                          backgroundColor: '#91ad41',
                          color: '#fff',
                        },
                      }),
                      input: (baseStyles) => ({
                        ...baseStyles,
                        padding: '4px 0px',
                        pointerEvents: 'none',
                      }),
                      singleValue: (baseStyles) => ({
                        ...baseStyles,
                        padding: '4px 0px',
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        padding: '0px',
                        height: '100%',
                        backgroundColor: '#fff',
                        boxShadow: 'none',
                        border: 'none',
                      }),
                    }}
                    options={shippingStatusOptions}
                    onChange={setShippingStatus}
                    defaultValue={shippingStatus}
                    value={shippingStatus}
                  />
                </div>
              </form>
              <span className='block mb-10'>
                <span className='text-red-500'>*</span> Sau khi cập nhật trạng
                thái đơn hàng, khách hàng của bạn sẽ được thông báo về sự cập
                nhật.
              </span>
            </Modal.Body>
            <Modal.Footer className='pb-1.5'>
              <div className='flex items-center justify-end gap-3'>
                <button
                  className='px-4 py-3 text-white transition-opacity rounded-md bg-slate-400 hover:opacity-80 min-w-[80px]'
                  onClick={() => setShowModalUpdateOrder(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className='px-4 py-3 text-white transition-opacity bg-thirdColor rounded-md hover:opacity-80 min-w-[80px]'
                  onClick={handleUpdateOrder}
                >
                  Cập nhật
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        </Portal>
      )}
    </div>
  );
};

export default Order;
