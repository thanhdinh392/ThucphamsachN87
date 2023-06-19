import { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import BreadCrumb from '../../components/BreadCrumb';
import { Loading } from '../../components/Loading';
import useSearchParams from './../../hooks/useSearchParams';
import { setCurrentUser } from '../../redux/userSlice';
import authApi from './../../api/authApi';
import handleLocalStorage from '../../utils/handleLocalStorage';
import handleAuthToken from './../../utils/handleAuthToken';

import { facebookBtn, googleBtn } from '../../assets/images/socials';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useSelector((state) => state.user.currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (currentUser && searchParams.get('redirect')) {
      navigate(searchParams.get('redirect'));
    }

    if (currentUser && !searchParams.get('redirect')) {
      navigate('/');
    }
  }, [currentUser, searchParams, navigate]);

  const schema = yup.object({
    email: yup
      .string()
      .required('Email là bắt buộc')
      .email('Vui lòng nhập đúng email'),
    password: yup
      .string()
      .required('Mật khẩu là bắt buộc')
      .min(8, 'Mật khẩu phải tối thiểu 8 kí tự'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const handleLogin = async (values) => {
    setIsLoading(true);
    if (!values) return;

    try {
      const res = await authApi.login(values);
      if (!res.data.success) {
        toast.error(res.data.message);
        reset({
          password: '',
        });
        return;
      }

      const { user } = res.data;
      const currentUser = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      };
      dispatch(setCurrentUser(currentUser));
      handleLocalStorage.set('accessToken', res.data.accessToken);
      handleAuthToken(res.data.accessToken);
      toast.success(res.data.message);

      if (searchParams.get('redirect')) {
        navigate(searchParams.get('redirect'));
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorMessage =
        error.response.data?.message ||
        'Có lỗi xảy ra phía máy chủ, vui lòng thử lại!';
      toast.error(errorMessage);
      reset({
        password: '',
      });
    }
    setIsLoading(false);
  };

  return (
    <Fragment>
      <BreadCrumb isLoading={isLoading} />
      <div className='container'>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className='w-full max-w-[540px] p-4 mx-auto my-10 text-center'
        >
          <div>
            <h3 className='uppercase text-[26px] mb-6'>Đăng nhập tài khoản</h3>
            <div className='flex justify-center gap-1 mb-7'>
              <div className='max-w-[129px] w-full hover:opacity-80 cursor-pointer'>
                <img src={facebookBtn} alt='Login with Facebook' />
              </div>
              <div className='max-w-[129px] w-full hover:opacity-80 cursor-pointer'>
                <img src={googleBtn} alt='Login with Google' />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-[18px]'>
            <div>
              <input
                type='text'
                name='email'
                className='bg-white block+ w-full py-2.5 px-6 text-black border border-borderColor outline-none min-h-[50px] rounded-full'
                placeholder='Email'
                {...register('email')}
                autoComplete='username'
              />
              <span className='block mt-1 ml-3 text-left text-red-500'>
                {errors.email?.message}
              </span>
            </div>
            <div>
              <input
                type='password'
                name='password'
                className='bg-white block w-full py-2.5 px-6 text-black border border-borderColor outline-none min-h-[50px] rounded-full'
                placeholder='Mật khẩu'
                {...register('password')}
                autoComplete='current-password'
              />
              <span
                className={`block text-left mt-1 ml-3 ${
                  errors.password?.message ? 'text-red-500' : 'text-textColor'
                }`}
              >
                {errors.password?.message || (
                  <span>
                    <span className='font-bold text-red-500'>*</span> Sử dụng từ
                    8 kí tự trở lên
                  </span>
                )}
              </span>
            </div>
            <button
              type='submit'
              className='flex items-center justify-center w-full gap-3 py-4 text-white rounded-full gradient-primary hover:bg-primaryColor hover:bg-none'
            >
              {isLoading && <Loading />} <span>Đăng nhập</span>
            </button>
          </div>

          <div>
            <p className='underline text-primaryColor text-[15px] cursor-pointer mt-4'>
              Quên mật khẩu
            </p>

            <p className='mt-6 text-textColor'>
              Bạn chưa có tài khoản? vui lòng đăng ký
              <Link to='/register'>
                <span className='ml-1 underline '>tại đây</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Login;
