import { useRef } from 'react';
import PropTypes from 'prop-types';

import useCLickOutSide from './../../hooks/useClickOutSide';

const Modal = ({ children, showModal, handleCloseModal, className = '' }) => {
  const modalRef = useRef(null);
  useCLickOutSide(modalRef, handleCloseModal);

  return (
    <div
      className={`fixed w-full h-full top-0 left-0 z-[1999] transition-all ${
        showModal ? 'bg-black/50 visible' : 'bg-black/0 invisible'
      }`}
    >
      <div className={`${className}`} ref={modalRef}>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  showModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const Header = ({ children, handleCloseModal, className = '' }) => {
  return (
    <div className={`${className} bg-white flex items-start`}>
      {children}
      <button
        onClick={handleCloseModal}
        className='block px-4 pt-2 ml-auto text-xl hover:opacity-50'
      >
        <i className='fa-solid fa-xmark'></i>
      </button>
    </div>
  );
};

Header.propTypes = {
  children: PropTypes.node,
  handleCloseModal: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const Body = ({ children, className = '' }) => {
  return <div className={`${className}`}>{children}</div>;
};

Body.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const Footer = ({ children, className = '' }) => {
  return <div className={`${className}`}>{children}</div>;
};

Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
