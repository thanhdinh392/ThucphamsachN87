import { Fragment } from 'react';
import PropTypes from 'prop-types';

import Modal from './Modal';
import Portal from './Portal';
import ProductDetailContent from '../ProductDetailContent';

const ProductDetailModal = ({
  product,
  handleCloseModal,
  showModal,
  setShowModal,
  classContainer,
  setShowProductConfirmModal,
}) => {
  return (
    <Fragment>
      <Portal showModal={showModal} classContainer={classContainer}>
        <Modal
          className={`${classContainer} py-1 px-4 fixed z-[2000] xl:w-[85%] 2xl:w-[70%] 3xl:w-[60%] top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white rounded-[20px] overflow-hidden shadow-lg`}
          showModal={showModal}
          handleCloseModal={handleCloseModal}
        >
          <Modal.Header handleCloseModal={handleCloseModal} />
          <Modal.Body className='pb-6 bg-white'>
            <ProductDetailContent
              product={product}
              setShowProductConfirmModal={setShowProductConfirmModal}
              setShowModal={setShowModal}
              showModal={showModal}
              className='gap-5'
            />
          </Modal.Body>
        </Modal>
      </Portal>
    </Fragment>
  );
};

ProductDetailModal.propTypes = {
  product: PropTypes.object.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  classContainer: PropTypes.string.isRequired,
};

export default ProductDetailModal;
