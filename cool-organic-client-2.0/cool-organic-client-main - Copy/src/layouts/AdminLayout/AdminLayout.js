import PropTypes from 'prop-types';
import SideBar from './SideBar';

const AdminLayout = ({ children }) => {
  return (
    <div className='flex'>
      <div className='w-[300px]'>
        <SideBar />
      </div>
      <div className='flex-1 px-6'>
        <div>
          <h2 className='text-2xl font-semibold'>Trang quản trị</h2>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
