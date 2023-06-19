import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Portal from './Portal';
import Modal from './Modal';
import formatPrice from './../../utils/formatPrice';

const ProductConfirmModal = ({
  product,
  handleCloseModal,
  showModal,
  classContainer,
}) => {
  const cart = useSelector((state) => state.cart);
  return (
    <Portal showModal={showModal} classContainer={classContainer}>
      <Modal
        className={`${classContainer} fixed z-[2000] top-[8%] left-[50%] translate-x-[-50%] rounded-[20px] overflow-hidden`}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
      >
        <Modal.Header handleCloseModal={handleCloseModal} className='pt-1' />
        <Modal.Body className='flex'>
          <div className='bg-[#f8f8f8] pl-6 pt-2 pr-10'>
            <div className='mb-6'>
              <span className='mr-2 text-primaryColor'>
                <i className='fa-solid fa-check'></i>
              </span>
              <span>Sản phẩm đã được thêm vào giỏ hàng</span>
            </div>
            <div className='flex gap-5'>
              <div className='w-[97px] h-[97px] border-2 border-primaryColor'>
                <img src={product.images[0].url} alt={product.name} />
              </div>
              <div>
                <span className='block mb-3'>{product.name}</span>
                <span>{formatPrice(product.salePrice)}</span>
              </div>
            </div>
          </div>
          <div className='pt-2 pb-8 pl-6 pr-12 bg-white'>
            <span>Giỏ hảng của bạn {`(${cart.products.length} sản phẩm)`}</span>
            <div className='flex items-center mt-8'>
              <span className='mr-2'>Tổng tiền:</span>
              <span className='text-xl font-bold'>
                {formatPrice(cart.totalPrice)}
              </span>
            </div>
            <Link
              className='inline-block px-11 mt-5 h-[56px] leading-[56px] text-base font-medium text-center text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
              to='/cart'
            >
              Đi đến giỏ hàng
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </Portal>
  );
};

ProductConfirmModal.propTypes = {
  product: PropTypes.object.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  classContainer: PropTypes.string.isRequired,
};

export default ProductConfirmModal;
