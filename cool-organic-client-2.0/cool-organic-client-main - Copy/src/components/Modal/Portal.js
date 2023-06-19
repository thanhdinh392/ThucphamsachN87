import { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const Portal = ({ children, showModal, classContainer }) => {
  useEffect(() => {
    if (!showModal) {
      const element = document.querySelector(`.${classContainer}`);
      element?.remove();
    }
  }, [showModal]);

  return (
    <Fragment>
      {showModal && ReactDOM.createPortal(children, document.body)}
    </Fragment>
  );
};

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  showModal: PropTypes.bool.isRequired,
  classContainer: PropTypes.string.isRequired,
};

export default Portal;
