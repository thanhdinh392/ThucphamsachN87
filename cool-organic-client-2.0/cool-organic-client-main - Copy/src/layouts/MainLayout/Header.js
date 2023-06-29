import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import useCLickOutSide from '../../hooks/useClickOutSide';
import { removeCurrentUser } from '../../redux/userSlice';
import categoryApi from './../../api/categoryApi';

import { logo } from '../../assets/images/common';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const inputRef = useRef('');
  const wrapperInputRef = useRef(null);
  useCLickOutSide(wrapperInputRef, () => setShowSearchInput(false));

  const cart = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const onKeyDown = (e) => {
      const keyword = inputRef.current.value;
      const isFocus = document.activeElement === inputRef.current;
      if (e.key === 'Enter' && isFocus) {
        if (keyword) {
          navigate(`/search?q=${keyword}`);
          inputRef.current.value = '';
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await categoryApi.getCategories({
          params: {
            limit: 5,
          },
        });
        const categories = [];
        for (let i = 0; i < res.data.categories.length; i++) {
          const category = res.data.categories[i];
          const obj = {
            name: category.name,
            path: `/${category.categorySlug}`,
          };
          categories.push(obj);
        }
        setCategories(categories);
      } catch (error) {
        console.log(error);
      }
    };

    getCategories();
  }, []);

  const menuItems = [
    {
      name: 'Trang chủ',
      path: '/',
    },
    {
      name: 'Giới thiệu',
      path: '/introduce',
    },
    {
      name: 'Sản phẩm',
      path: '/products',
      children: [...categories],
    },
    {
      name: 'Liên hệ',
      path: '/contact',
    },
  ];

  const menuItemsOnMobileTablet = [
    ...menuItems,
    {
      name: 'Đăng nhập',
      path: '/login',
    },
    {
      name: 'Đăng ký',
      path: '/register',
    },
  ];

  return (
    <div className='container h-[120px] flex items-center justify-between'>
      <div
        className='block cursor-pointer lg:hidden'
        onClick={() => setShowMenu(true)}
      >
        <span className='text-[1.75rem] text-primaryColor '>
          <i className='fas fa-bars'></i>
        </span>
      </div>

      <div
        className={`fixed top-0 left-0 h-screen z-[1000] md:w-[320px] w-[260px] bg-white transition-all duration-300 lg:hidden ${
          showMenu
            ? 'translate-x-0 opacity-100'
            : 'translate-x-[-100%] opacity-100'
        }`}
      >
        <div className='block my-8 text-center'>
          <div className='inline-block'>
            <img src={logo} alt='' />
          </div>
        </div>
        <div className='flex flex-col items-center mt-3'>
          {menuItemsOnMobileTablet.map((item, index) => (
            <div
              key={index}
              className={`overflow-hidden h-full w-full text-lg border-t border-borderColor last:border-b ${
                window.location.pathname === item.path
                  ? 'text-white bg-primaryColor'
                  : 'text-black bg-white'
              }`}
              onClick={() => {
                setShowMenu(false);
                navigate(item.path);
              }}
            >
              <div className='flex justify-between'>
                <span className='block py-4 pl-4'>{item.name}</span>
                {item.children && (
                  <span
                    className='px-4 py-4'
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSubMenu(!showSubMenu);
                    }}
                  >
                    <i className='fa-solid fa-caret-down'></i>
                  </span>
                )}
              </div>

              {item.children && (
                <div
                  className={`bg-white transition-all duration-500 ${
                    showSubMenu ? 'max-h-[1000px] visible' : 'max-h-0 invisible'
                  }`}
                >
                  {item.children.map((subItem, index) => (
                    <div
                      key={index}
                      className={`border-t border-borderColor block pl-7 py-4 first:border-t-0 ${
                        window.location.pathname === subItem.path
                          ? 'text-white bg-primaryColor'
                          : 'text-black bg-white'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(subItem.path);
                        setShowMenu(false);
                      }}
                    >
                      {subItem.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 w-full h-full bg-black transition-all duration-300 z-[100] lg:hidden ${
          showMenu ? 'visible opacity-[0.65]' : 'invisible opacity-0'
        }`}
        onClick={() => setShowMenu(false)}
      ></div>

      <Link to='/' className='w-[50%] md:w-[auto]'>
        <img src={logo} alt='Logo' />
      </Link>

      <ul className='items-center hidden h-full gap-3 lg:flex'>
        {menuItems.map((item, index) => (
          <li className='relative h-full select-none group' key={index}>
            <div
              className={`block h-full leading-[120px] px-2.5 hover:text-primaryColor cursor-pointer ${
                window.location.pathname === item.path
                  ? 'text-primaryColor'
                  : 'text-black'
              }`}
              onMouseOver={() => {
                if (item.children) {
                  setShowSubMenu(true);
                }
              }}
              onMouseLeave={() => setShowSubMenu(false)}
              onClick={() => navigate(item.path)}
            >
              <span>{item.name}</span>
              {item.children && (
                <span className='ml-2'>
                  <i className='fa-solid fa-caret-down'></i>
                </span>
              )}

              {item.children && showSubMenu && (
                <div className='leading-4 absolute z-[100] px-3.5 bg-white shadow-[0_1px_2px_2px_rgba(0,0,0,0.2)] w-[200%] top-[70%] rounded-lg'>
                  {item.children.map((subItem, index) => (
                    <div
                      className={`border-t border-borderColor hover:text-primaryColor block py-4 first:border-t-0 ${
                        window.location.pathname === subItem.path
                          ? 'text-primaryColor'
                          : 'text-black'
                      }`}
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSubMenu(false);
                        navigate(subItem.path);
                      }}
                    >
                      {subItem.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className='flex items-center gap-4'>
        <div className='relative cursor-pointer group' ref={wrapperInputRef}>
          <i
            className='md:pl-4 md:p-2 fa-solid fa-magnifying-glass'
            onClick={() => setShowSearchInput(!showSearchInput)}
          ></i>
          <div
            className={`absolute text-black right-[-12px] top-10 lg:group-hover:block lg:hidden w-[250px] z-10 ${
              showSearchInput ? 'block' : 'hidden'
            }`}
          >
            <div className='absolute top-[-20px] right-4 w-14 h-6 bg-transparent hidden lg:block'></div>
            <input
              type='text'
              ref={inputRef}
              placeholder='Tìm kiếm...'
              className='py-2.5 pl-4 pr-10 border-2 rounded-full shadow-md border-primaryColor'
            />
            <div
              className='absolute top-[30%] pb-2 right-8 h-full z-2'
              onClick={() => {
                if (inputRef.current.value) {
                  navigate(`/search?q=${inputRef.current.value}`);
                  inputRef.current.value = '';
                }
              }}
            >
              <i className='fa-solid fa-magnifying-glass'></i>
            </div>
          </div>
        </div>
        <div className='relative hidden cursor-pointer lg:block group'>
          <i className='p-2 fa-solid fa-user-plus'></i>
          <div className='absolute h-5 bg-transparent top-6 right-[20%] w-10 z-[101]'></div>

          {currentUser ? (
            <div className='absolute top-10 hidden p-2.5 rounded-xl group-hover:block w-56 right-[20%] z-[100] border border-primaryColor shadow bg-white'>
              <Link
                className='block w-full h-full py-2 mb-2 text-base text-center text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
                to='/my-info'
              >
                Tài khoản
              </Link>
              <button
                className='block w-full h-full py-2 text-base text-center text-black border rounded-full hover:text-white hover:bg-primaryColor hover:bg-none border-borderColor'
                onClick={() => {
                  dispatch(removeCurrentUser());
                  navigate('/');
                }}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className='absolute top-10 hidden p-2.5 rounded-xl group-hover:block w-56 right-[20%] z-[100] border border-primaryColor shadow bg-white'>
              <Link
                className='block w-full h-full py-2 mb-2 text-base text-center text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
                to='/login'
              >
                Đăng nhập
              </Link>
              <Link
                className='block w-full h-full py-2 text-base text-center text-black border rounded-full hover:text-white hover:bg-primaryColor hover:bg-none border-borderColor'
                to='/register'
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
        <div className='mr-3.5 ml-2.5 md:ml-0'>
          <Link to='/cart' className='relative'>
            <i className='md:p-1.5 fa-solid fa-cart-shopping'></i>
            {currentUser && !cart.isLoading && cart.products.length > 0 && (
              <span className='flex gradient-primary absolute text-white text-sm bottom-[80%] left-[50%] top-[-70%] w-[26px] h-[26px] rounded-full items-center justify-center'>
                {cart.products.length <= 99 ? cart.products.length : '99+'}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
