import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';

import OrderDetail from '../../UserInfo/OrderDetail';
import Modal from '../../../components/Modal/Modal';
import Portal from '../../../components/Modal/Portal';
import orderApi from './../../../api/orderApi';

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
    value: 'Giao hàng thàng công',
    label: 'Giao hàng thàng công',
  },
];

const ViewOrder = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [shippingStatus, setShippingStatus] = useState(null);
  const [isFetch, setIsFetch] = useState(false);

  const [showModalDeleteOrder, setShowModalDeleteOrder] = useState(false);
  const [showModalUpdateOrder, setShowModalUpdateOrder] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteOrder = async () => {
    try {
      await orderApi.deleteOrder(id);
      toast.success('Xóa đơn hàng thành công!');
      navigate(-1);
    } catch (error) {
      console.log(error);
      toast.error('Xóa đơn hàng thất bại, Vui lòng thử lại sau!');
    }
    setShowModalDeleteOrder(false);
  };

  const handleUpdateOrder = async () => {
    try {
      await orderApi.updateStatusOrder(id, {
        shippingStatus: shippingStatus.value,
        paymentStatus: paymentStatus.value,
      });

      setIsFetch(!isFetch);
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
    } catch (error) {
      console.log(error);
      toast.error('Cập nhật trạng thái đơn hàng không thành công!');
    }
    setShowModalUpdateOrder(false);
  };

  const handleSetStatusOrder = (order) => {
    setPaymentStatus({
      value: order.paymentStatus,
      label: order.paymentStatus,
    });
    setShippingStatus({
      value: order.shippingStatus,
      label: order.shippingStatus,
    });
  };

  return (
    <Fragment>
      <div>
        <OrderDetail
          handleSetStatusOrder={handleSetStatusOrder}
          isFetch={isFetch}
        />
      </div>
      <div className='pb-5 mt-8 text-right'>
        <button
          className='mr-3 py-3 px-5 border rounded-lg text-white font-semibold bg-thirdColor border-[#ccc] transition-opacity hover:opacity-80'
          onClick={() => setShowModalUpdateOrder(true)}
        >
          Chỉnh Sửa Đơn Hàng
        </button>
        <button
          className='mr-9 py-3 px-5 border rounded-lg text-white font-semibold bg-red-500 border-[#ccc] transition-opacity hover:opacity-80'
          onClick={() => setShowModalDeleteOrder(true)}
        >
          Xóa Đơn Hàng
        </button>
      </div>

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
              <h3 className='text-lg font-medium leading-4'>
                Cập nhật trạng thái cho đơn hàng:
              </h3>
              <span className='block mb-3 text-lg font-semibold'>#{id}</span>
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
    </Fragment>
  );
};

export default ViewOrder;
