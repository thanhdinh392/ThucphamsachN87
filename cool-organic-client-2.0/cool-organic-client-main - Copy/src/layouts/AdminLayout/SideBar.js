import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { removeCurrentUser } from '../../redux/userSlice';
import { logo } from '../../assets/images/common';
import './AdminLayout.scss';

const sideBarList = [
  {
    name: 'Trang Điều Khiển',
    iconClass: 'fa-solid fa-grip',
    path: '/admin',
  },
  {
    name: 'Người Dùng',
    iconClass: 'fa-solid fa-user',
    path: '/admin/users',
  },
  {
    name: 'Sản Phẩm',
    iconClass: 'fa-solid fa-box',
    path: '/admin/products',
  },
  {
    name: 'Đơn Hàng',
    iconClass: 'fa-solid fa-cart-shopping',
    path: '/admin/orders',
  },
  {
    name: 'Danh Mục',
    iconClass: 'fa-solid fa-grip-vertical',
    path: '/admin/categories',
  },
  {
    name: 'Kho Hàng',
    iconClass: 'fa-solid fa-warehouse',
    path: '/admin/inventory',
  },
  {
    name: 'Đăng Xuất',
    iconClass: 'fa-solid fa-right-from-bracket',
    path: '/admin/login',
  },
];

const SideBar = () => {
  const dispatch = useDispatch();
  return (
    <div className='h-full min-h-screen shadow-xl'>
      <div className='flex items-center justify-center py-5'>
        <img src={logo} alt='Logo' className='w-[80%]' />
      </div>
      <div className='px-5'>
        {sideBarList.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center w-full py-3.5 pl-5 font-semibold rounded-xl ${
              window.location.pathname === item.path
                ? 'bg-primaryColor text-white'
                : 'bg-white hover:text-primaryColor'
            }`}
            onClick={() => {
              if (item.path === '/admin/login') {
                dispatch(removeCurrentUser());
              }
            }}
          >
            <i
              className={`${item.iconClass} text-lg w-[40px] icon-sidebar relative`}
            />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
