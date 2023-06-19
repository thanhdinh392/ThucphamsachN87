import { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, roleListPermission }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const isLoadingCurrentUser = useSelector((state) => state.user.isLoading);
  const navigate = useNavigate();

  const isPermittedRole =
    roleListPermission && roleListPermission.includes(currentUser?.role);

  useEffect(() => {
    if (!currentUser && !isLoadingCurrentUser) {
      toast.info('Bạn cần đăng nhập để tiếp tục');
      if (window.location.pathname.includes('admin')) {
        navigate(`/admin/login?redirect=${window.location.pathname}`);
      } else {
        navigate(`/login?redirect=${window.location.pathname}`);
      }
    }
    if (currentUser && !isPermittedRole && !isLoadingCurrentUser) {
      toast.error('Bạn không có quyền truy cập trang này');
      navigate('/');
    }
  }, [currentUser, isLoadingCurrentUser, isPermittedRole, navigate]);

  return <Fragment>{currentUser && isPermittedRole && children}</Fragment>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roleListPermission: PropTypes.array.isRequired,
};

export default ProtectedRoute;
